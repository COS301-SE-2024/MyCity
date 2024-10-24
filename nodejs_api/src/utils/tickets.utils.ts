import { GetCommandInput, GetCommandOutput, QueryCommandInput, QueryCommandOutput, ScanCommandInput, ScanCommandOutput, UpdateCommandInput, UpdateCommandOutput } from "@aws-sdk/lib-dynamodb";
import { cognitoClient, COMPANIES_TABLE, MUNICIPALITIES_TABLE, TICKET_UPDATE_TABLE, TICKETS_TABLE } from "../config/dynamodb.config";
import { BadRequestError } from "../types/error.types";
import { AdminGetUserCommand, AdminGetUserCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { v4 as uuidv4 } from "uuid";
import { JobData } from "../types/job.types";
import { addJobToReadQueue, addJobToWriteQueue, addMultipleJobsToReadQueue } from "../services/jobs.service";
import { DB_GET, DB_QUERY, DB_SCAN, DB_UPDATE } from "../config/redis.config";

interface Company {
    name: string;
    pid: string;
}

export const getUserProfile = async (ticketData: any[]) => {
    const promises = [];
    const muniJobs: JobData[] = [];

    const USER_POOL_ID = process.env.USER_POOL_ID;
    for (let ticket of ticketData) {
        const cognitoUsername = (ticket["username"] as string).toLowerCase();
        const userResponsePromise = cognitoClient.send(
            new AdminGetUserCommand({
                UserPoolId: USER_POOL_ID,
                Username: cognitoUsername
            })
        );

        const muniParams: GetCommandInput = {
            TableName: MUNICIPALITIES_TABLE,
            Key: {
                "municipality_id": ticket.municipality_id
            }
        };

        const muniJobData: JobData = {
            type: DB_GET,
            params: muniParams
        };

        muniJobs.push(muniJobData);
        promises.push(userResponsePromise);
    }

    try {
        const muniResponses = await addMultipleJobsToReadQueue(muniJobs);

        muniResponses.forEach(async (jobResult, index) => {
            const responseMunicipality = await jobResult.finished() as GetCommandOutput;
            if (responseMunicipality.Item) {
                const municipality = responseMunicipality.Item;
                ticketData[index].municipality_picture = municipality["municipalityLogo"];
                ticketData[index].municipality = municipality["municipality_id"];
            } else {
                ticketData[index].municipality_picture = "";
                ticketData[index].municipality = "";
            }
        });

        const userResponses = await Promise.allSettled(promises);

        userResponses.forEach((result, index) => {
            if (result.status === "fulfilled") {
                const userResponse = result.value as AdminGetUserCommandOutput;
                let userImage: string | null = null;
                let userName: string | null = null;

                if (userResponse.UserAttributes) {
                    for (let attr of userResponse.UserAttributes) {
                        if (attr.Name === "picture") {
                            userImage = attr.Value!;
                        }
                        if (attr.Name === "given_name") {
                            userName = attr.Value!;
                        }

                        if (userImage && userName) {
                            break;
                        }
                    }
                }

                ticketData[index]["user_picture"] = userImage;
                ticketData[index]["createdby"] = userName;
            }
            else {
                if (result.reason.name === "UserNotFoundException") {
                    ticketData[index]["user_picture"] = "";
                    ticketData[index]["createdby"] = "deleted_user";
                }
                else {
                    console.error("An error occurred:", result.reason);
                }
            }
        });

    } catch (error: any) {
        throw error;
    }
};

export const convertDecimalToFloat = (obj: any) => {
    if (obj instanceof Number) {
        return parseFloat(obj.toString());
    }
    throw new TypeError();
};

export const validateTicketId = (ticketId: string): string => {
    // Allow only UUID format to prevent injection attacks
    if (!/^[a-fA-F0-9-]{36}$/.test(ticketId)) {
        // app.log.error("Invalid Ticket ID format")
        throw new BadRequestError("Invalid Ticket ID");
    }
    return ticketId;
};

export const updateTicketTable = async (ticket_id: string, ticketDateOpened: string, update_expression: string, expression_attribute_names: Record<string, string>, expression_attribute_values: Record<string, any>) => {
    try {
        const params: UpdateCommandInput = {
            TableName: TICKETS_TABLE,
            Key: {
                ticket_id: ticket_id,
                dateOpened: ticketDateOpened
            },
            UpdateExpression: update_expression,
            ExpressionAttributeNames: expression_attribute_names,
            ExpressionAttributeValues: expression_attribute_values
        };

        const jobData: JobData = {
            type: DB_UPDATE,
            params: params
        };

        const writeJob = await addJobToWriteQueue(jobData);
        const response = await writeJob.finished() as UpdateCommandOutput;
        return response;
    } catch (error: any) {
        throw new BadRequestError(`Failed to update ticket: ${error.message}`);
    }
};

export const getCompanyIDFromName = async (companyName: string) => {
    try {
        const params: QueryCommandInput = {
            TableName: COMPANIES_TABLE,
            IndexName: "name-index",
            KeyConditionExpression: "#name = :name",
            ExpressionAttributeNames: {
                "#name": "name"
            },
            ExpressionAttributeValues: {
                ":name": companyName
            },
            ProjectionExpression: "pid"
        };

        const jobData: JobData = {
            type: "DB_QUERY",
            params: params
        };

        const readJob = await addJobToReadQueue(jobData);
        const response = await readJob.finished() as QueryCommandOutput;
        const items = response.Items as Company[] || [];

        const company = items.length > 0 ? items[0] : null;
        return company ? company.pid : null;
    } catch (error) {
        console.error('Error fetching company ID:', error);
        return null;
    }
};

export const generateId = (): string => {
    return uuidv4();
};

export const generateTicketNumber = (municipalityName: string): string => {
    // Extract the first letter and convert it to uppercase
    const municipalityCode = municipalityName.charAt(0).toUpperCase();
    const validChars = municipalityName.replace(/[\s-]/g, '').toUpperCase();
    const muni = validChars.slice(1, 3);

    // Get the current date
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Last two digits of the year
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month in two digits
    const day = now.getDate().toString().padStart(2, "0"); // Day in two digits

    const year1 = year.charAt(0);
    const restOfTheYear = year.slice(1);

    // Generate the 4 random digits or letters in uppercase
    const randomItem = uuidv4().replace(/-/g, "").slice(0, 4).toUpperCase();

    // Construct the ticket number according to the format mmmY-YMMD-DRRR
    const ticketNumber = `${municipalityCode}${muni}${year1}-${restOfTheYear}${month}${day}-${randomItem}`;

    return ticketNumber;
};

export const updateCommentCounts = async (items: any[], batchSize: number = 10) => {
    // // split items into smaller batches
    // for (let i = 0; i < items.length; i += batchSize) {
    //     const batch = items.slice(i, i + batchSize);

    //     const queryPromises = batch.map(async (item) => {
    //         const params: QueryCommandInput = {
    //             TableName: TICKET_UPDATE_TABLE,
    //             IndexName: "ticket_id-index",
    //             KeyConditionExpression: "ticket_id = :ticket_id",
    //             ExpressionAttributeValues: {
    //                 ":ticket_id": item.ticket_id
    //             },
    //             Select: "COUNT"
    //         };

    //         const jobData: JobData = {
    //             type: DB_QUERY,
    //             params: params
    //         };

    //         const readJob = await addJobToReadQueue(jobData);
    //         const queryResponse = await readJob.finished() as QueryCommandOutput;
    //         item.commentcount = queryResponse.Count || 0;
    //     });

    //     // wait for this batch of queries to complete before continuing
    //     const resultspromises = await Promise.allSettled(queryPromises);

    //     resultspromises.forEach((result, index) => {
    //         if (result.status === "rejected") {
    //             console.error(`Promise ${index} failed with error: ${result.reason}`);
    //         }
    //     });
    // }

    const getCommentCountJobs: JobData[] = [];

    for (let item of items) {
        const params: QueryCommandInput = {
            TableName: TICKET_UPDATE_TABLE,
            IndexName: "ticket_id-index",
            KeyConditionExpression: "ticket_id = :ticket_id",
            ExpressionAttributeValues: {
                ":ticket_id": item.ticket_id
            },
            Select: "COUNT"
        };

        const jobData: JobData = {
            type: DB_QUERY,
            params: params
        };

        getCommentCountJobs.push(jobData);
    }

    const commentCountResults = await addMultipleJobsToReadQueue(getCommentCountJobs);

    commentCountResults.forEach(async (jobResult, index) => {
        const response = await jobResult.finished() as QueryCommandOutput;
        const commentCount = response.Count || 0;
        items[index].commentcount = commentCount;
    });
};

export const getDistance = (origin: [number, number], destination: [number, number]): number => {
    const [lat1, lon1] = origin;
    const [lat2, lon2] = destination;
    const radius = 6371; // km

    const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = radius * c;

    return d;
};

export const getMunicipality = async (latitude: number, longitude: number): Promise<string> => {
    let municipality = "";
    let minDistance = Number.MAX_SAFE_INTEGER;

    let responseMuni: any;
    let items: any = [];
    let lastEvaluatedKey;

    do {
        const params: ScanCommandInput = {
            TableName: MUNICIPALITIES_TABLE,
            ProjectionExpression: "longitude, latitude, municipality_id",
            ExclusiveStartKey: lastEvaluatedKey
        };
        const jobData: JobData = {
            type: DB_SCAN,
            params: params
        };

        const readJob = await addJobToReadQueue(jobData);
        const responseMuni = await readJob.finished() as ScanCommandOutput;

        if (responseMuni.Items) {
            items = items.concat(responseMuni.Items);
        }

        lastEvaluatedKey = responseMuni.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    if (items && items.length > 0) {
        for (const item of items) {
            const cleanLat = parseFloat(item.latitude.toString().trim());
            const cleanLong = parseFloat(item.longitude.toString().trim());
            const origin: [number, number] = [cleanLat, cleanLong];
            const destination: [number, number] = [latitude, longitude];
            const distance = getDistance(origin, destination);

            if (minDistance > distance) {
                municipality = item.municipality_id;
                minDistance = distance;
            }
        }
    }

    return municipality === "" ? "NOT APPLICABLE" : municipality;
};

export const capitaliseUserEmail = (email: string): string => {
    const emailParts = email.split("@");
    const namepart = emailParts[0];
    const domainpart = emailParts[1];
    const capitalisedNamePart = namepart.toLowerCase().split(".").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(".");
    const result = capitalisedNamePart + "@" + domainpart;
    return result;
};

export const getTicketDateOpened = async (ticketId: string) => {
    // get dateOpened attribute from tickets table
    const params: QueryCommandInput = {
        TableName: TICKETS_TABLE,
        KeyConditionExpression: "ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":ticket_id": ticketId
        },
        ProjectionExpression: "dateOpened"
    };
    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    };
    const readJob = await addJobToReadQueue(jobData);
    const queryResult = await readJob.finished() as ScanCommandOutput;

    const queryResultItems = queryResult.Items;

    if (!queryResultItems || queryResultItems.length === 0) {
        return null;
    }

    const dateOpened = queryResultItems[0].dateOpened as string;
    return dateOpened;
};
