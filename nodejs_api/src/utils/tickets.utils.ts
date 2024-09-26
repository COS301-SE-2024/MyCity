import { GetCommand, QueryCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { cognitoClient, COMPANIES_TABLE, dynamoDBDocumentClient, MUNICIPALITIES_TABLE, TICKET_UPDATE_TABLE, TICKETS_TABLE } from "../config/dynamodb.config";
import { BadRequestError } from "../types/error.types";
import { AdminGetUserCommand, AdminGetUserCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { v4 as uuidv4 } from "uuid";

interface Company {
    name: string;
    pid: string;
}

export const getUserProfile = async (ticketData: any[]) => {
    let cognitoUsername = "";
    try {
        const USER_POOL_ID = process.env.USER_POOL_ID;
        for (let ticket of ticketData) {
            cognitoUsername = (ticket["username"] as string).toLowerCase();
            const userResponse: AdminGetUserCommandOutput = await cognitoClient.send(
                new AdminGetUserCommand({
                    UserPoolId: USER_POOL_ID,
                    Username: cognitoUsername
                })
            );

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

            ticket["user_picture"] = userImage;
            ticket["createdby"] = userName;

            const responseMunicipality = await dynamoDBDocumentClient.send(
                new GetCommand({
                    TableName: MUNICIPALITIES_TABLE,
                    Key: {
                        "municipality_id": ticket.municipality_id
                    }
                })
            );

            if (responseMunicipality.Item) {
                const municipality = responseMunicipality.Item;
                ticket.municipality_picture = municipality["municipalityLogo"];
                ticket.municipality = municipality["municipality_id"];
            } else {
                ticket.municipality_picture = "";
                ticket.municipality = "";
            }
        }

    } catch (error: any) {
        if (error.name === "UserNotFoundException") {
            console.error(`${error.message}: ${cognitoUsername}`);
        } else {
            console.error("An error occurred:", error);
        }
    }
};

export const doesTicketExist = async (ticket_id: string) => {
    try {
        const checking_ticket = await dynamoDBDocumentClient.send(
            new QueryCommand({
                TableName: TICKETS_TABLE,
                KeyConditionExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": ticket_id
                }
            })
        );

        return checking_ticket.Items && checking_ticket.Items.length > 0;

    } catch (error: any) {
        console.error("An error occurred:", error);
        return false;
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

export const updateTicketTable = async (ticket_id: string, update_expression: string, expression_attribute_names: Record<string, string>, expression_attribute_values: Record<string, any>) => {
    try {
        const response = await dynamoDBDocumentClient.send(
            new UpdateCommand({
                TableName: TICKETS_TABLE,
                Key: {
                    ticket_id: ticket_id
                },
                UpdateExpression: update_expression,
                ExpressionAttributeNames: expression_attribute_names,
                ExpressionAttributeValues: expression_attribute_values
            })
        );

        return response;
    } catch (error: any) {
        throw new BadRequestError(`Failed to update ticket: ${error.message}`);
    }
};

export const getCompanyIDFromName = async (companyName: string) => {
    try {
        const response = await dynamoDBDocumentClient.send(new QueryCommand({
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
        }
        ));
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

export const updateCommentCounts = async (items: any[], batchSize: number = 7) => {
    // split items into smaller batches
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);

        const queryPromises = batch.map(async (item) => {
            const updateCommand = new QueryCommand({
                TableName: TICKET_UPDATE_TABLE,
                IndexName: "ticket_id-index",
                KeyConditionExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": item.ticket_id
                },
                Select: "COUNT"
            });

            const queryResponse = await dynamoDBDocumentClient.send(updateCommand);
            item.commentcount = queryResponse.Count || 0;
        });

        // wait for this batch of queries to complete before continuing
        await Promise.all(queryPromises);
    }
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
        responseMuni = await dynamoDBDocumentClient.send(new ScanCommand({
            TableName: MUNICIPALITIES_TABLE,
            ProjectionExpression: "longitude, latitude, municipality_id",
            ExclusiveStartKey: lastEvaluatedKey
        }));

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

// export const formatResponse = (statusCode: number, body: any) => {
//     return new Response(
//         JSON.stringify(body, (key, value) => {
//             return typeof value === 'object' && value !== null ? convertDecimalToFloat(value) : value;
//         }),
//         {
//             status: statusCode,
//             headers: {
//                 "Access-Control-Allow-Origin": "*",
//                 "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
//                 "Access-Control-Allow-Headers": "Authorization,Content-Type,X-Amz-Date,X-Amz-Security-Token,X-Api-Key",
//             },
//         }
//     );
// };
