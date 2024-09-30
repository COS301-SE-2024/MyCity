import { QueryCommand, UpdateCommand, QueryCommandInput, PutCommand, GetCommandInput, GetCommandOutput, PutCommandInput, QueryCommandOutput, ScanCommandInput, ScanCommandOutput, PutCommandOutput, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { BadRequestError, ClientError } from "../types/error.types";
import { ASSETS_TABLE, dynamoDBDocumentClient, TENDERS_TABLE, TICKET_UPDATE_TABLE, TICKETS_TABLE, WATCHLIST_TABLE } from "../config/dynamodb.config";
import { generateId, generateTicketNumber, getCompanyIDFromName, getMunicipality, getTicketDateOpened, getUserProfile, updateCommentCounts, updateTicketTable, validateTicketId } from "../utils/tickets.utils";
import { uploadFile } from "../config/s3bucket.config";
import WebSocket from "ws";
import { addJobToReadQueue, addJobToWriteQueue, invalidateCacheOnTicketUpdateOnly } from "./jobs.service";
import { JobData } from "../types/job.types";
import { DB_GET, DB_PUT, DB_QUERY, DB_SCAN, DB_UPDATE } from "../config/redis.config";

interface Ticket {
    dateClosed: string;
    ticket_id: string;
    upvotes: number;
    ticketnumber: string;
    address: string;
    asset_id: string;
    state: string;
    dateOpened: string;
    imageURL: string;
    viewcount: number;
    longitude: string;
    username: string;
    description: string;
    latitude: string;
    municipality_id: string;
    commentcount: number
    user_picture: string;
    createdby: string;
    municipality_picture: string;
    municipality: string;
}

interface TicketData {
    username: string;
    ticket_id: string;
}


export const createTicket = async (formData: any, file: Express.Multer.File | undefined, cacheKey: string) => {
    invalidateCacheOnTicketUpdateOnly();

    const username = formData["username"] as string;
    let imageLink = "";
    if (file) {
        imageLink = await uploadFile("ticket_images", username, file);
    }

    // Ensure asset exists
    const assetId = String(formData.asset);
    const assetParams: GetCommandInput = {
        TableName: ASSETS_TABLE,
        Key: { asset_id: assetId },
    };

    const assetJobdata: JobData = {
        type: DB_GET,
        params: assetParams,
        cacheKey: `sub/1${cacheKey}`
    }

    const assetReadJob = await addJobToReadQueue(assetJobdata, { priority: 1 });
    const assetResponse = await assetReadJob.finished() as GetCommandOutput;

    if (!assetResponse.Item) {
        const errorResponse = {
            Error: {
                Code: "ResourceNotFoundException",
                Message: `Asset with ID ${assetId} does not exist`,
            },
        };
        throw new ClientError(errorResponse, "NoItems");
    }

    // Generate ticket ID
    const ticketId = generateId();

    const latitude = parseFloat(formData.latitude);
    const longitude = parseFloat(formData.longitude);

    // Get the address
    const address = formData.address;

    const municipalityId = await getMunicipality(latitude, longitude);

    const currentDatetime = new Date();
    const formattedDatetime = currentDatetime.toISOString();

    const ticketNumber = generateTicketNumber(municipalityId);

    // Create the ticket item
    const ticketItem = {
        ticket_id: ticketId,
        asset_id: assetId,
        address: address,
        dateClosed: "<empty>",
        dateOpened: formattedDatetime,
        description: formData.description,
        imageURL: imageLink,
        latitude: latitude,
        longitude: longitude,
        municipality_id: municipalityId,
        username: formData.username,
        state: formData.state, // do not hard code, want to extend in future
        upvotes: 0,
        viewcount: 0,
        ticketnumber: ticketNumber,
        updatedAt: formattedDatetime,
    };

    const putItemParams: PutCommandInput = {
        TableName: TICKETS_TABLE,
        Item: ticketItem,
    };

    const jobData: JobData = {
        type: DB_PUT,
        params: putItemParams
    }

    // Put the ticket item into the tickets table
    const putItemJob = await addJobToWriteQueue(jobData);
    const putItemResponse = await putItemJob.finished() as PutCommandOutput;


    // Put ticket on their watchlist
    const watchlistId = generateId();

    const watchlistItem = {
        watchlist_id: watchlistId,
        ticket_id: ticketId,
        user_id: formData.username,
    };

    const putWatchlistParams: PutCommandInput = {
        TableName: WATCHLIST_TABLE,
        Item: watchlistItem,
    };

    const watchlistJobData: JobData = {
        type: DB_PUT,
        params: putWatchlistParams
    }

    const watchlistJob = await addJobToWriteQueue(watchlistJobData);
    const watchlistResponse = await watchlistJob.finished() as PutCommandOutput;

    const WEB_SOCKET_URL = String(process.env.WEB_SOCKET_URL);
    const ws = new WebSocket(WEB_SOCKET_URL);
    ws.on("open", () => {
        console.log(municipalityId);
        const message = JSON.stringify({ action: "createticket", body: municipalityId });
        ws.send(message);
    });

    // after accepting
    const accResponse = {
        message: "Ticket created successfully",
        ticket_id: ticketId,
        watchlist_id: watchlistId,
    };

    ws.close();

    return accResponse;
};

export const addWatchlist = async (ticketData: TicketData) => {
    const userExistsParams: QueryCommandInput = {
        TableName: WATCHLIST_TABLE,
        KeyConditionExpression: "user_id = :username AND ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":username": ticketData.username,
            ":ticket_id": ticketData.ticket_id
        }
    };

    const jobData: JobData = {
        type: DB_GET,
        params: userExistsParams
    };

    const userExistJob = await addJobToReadQueue(jobData);
    const userExist = await userExistJob.finished() as QueryCommandOutput;

    if (userExist.Items && userExist.Items.length > 0) {
        const errorResponse = {
            Error: {
                Code: "AlreadyExists",
                Message: "Already have ticket in watchlist",
            },
        };
        throw new ClientError(errorResponse, "AlreadyExists");
    }

    const ticketExists = await getTicketDateOpened(ticketData.ticket_id);

    if (!ticketExists) {
        const errorResponse = {
            Error: {
                Code: "TicketDoesntExists",
                Message: "Ticket doesn't exist",
            },
        };
        throw new ClientError(errorResponse, "TicketDoesntExists");
    }

    const watchlistId = generateId();

    const watchlistItem = {
        ticket_id: ticketData.ticket_id,
        user_id: ticketData.username
    };

    const putItemParams: PutCommandInput = {
        TableName: WATCHLIST_TABLE,
        Item: watchlistItem
    };
    const jobDataPut: JobData = {
        type: DB_PUT,
        params: putItemParams
    };
    const putItemJob = await addJobToWriteQueue(jobDataPut);
    await putItemJob.finished();

    return {
        Status: "Success",
        Message: `Ticket has been added to ${ticketData.username} with id of: ${watchlistId}`,
    };
};

export const getFaultTypes = async (cacheKey: string) => {
    const params: ScanCommandInput = {
        TableName: ASSETS_TABLE,
        ProjectionExpression: "asset_id, assetIcon, multiplier"
    };

    const jobData: JobData = {
        type: DB_SCAN,
        params: params
    };
    const job = await addJobToReadQueue(jobData);
    const response = await job.finished() as ScanCommandOutput;
    const assets = response.Items || [];

    const faultTypes = assets.map((asset: any) => ({
        asset_id: asset.asset_id,
        assetIcon: asset.assetIcon || "",
        multiplier: asset.multiplier || 1,
    }));

    return faultTypes;
};


export const getMyTickets = async (username: string | null, cacheKey: string) => {
    const params: QueryCommandInput = {
        TableName: TICKETS_TABLE,
        IndexName: "username-dateOpened-index",
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": username
        },
        ScanIndexForward: false, // sort in descending order (from most recent ticket to oldest)
    };

    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    };

    const job = await addJobToReadQueue(jobData);
    const response = await job.finished() as QueryCommandOutput;
    const items = response.Items || [];

    if (items && items.length > 0) {
        return items;
    } else {
        const errorResponse = {
            Error: {
                Code: "NoTickets",
                Message: "Doesn't have ticket",
            },
        };
        throw new ClientError(errorResponse, "NoTicket");
    }
};

export const getInMyMunicipality = async (municipality: string | null, cacheKey: string, lastEvaluatedKeyString: string) => {
    const params: QueryCommandInput = {
        TableName: TICKETS_TABLE,
        IndexName: "municipality_id-updatedAt-index",
        KeyConditionExpression: "municipality_id = :municipality_id",
        ExpressionAttributeValues: {
            ":municipality_id": municipality
        },
        ScanIndexForward: false, // sort in descending order (from most recent ticket to oldest)
        Limit: 15
    };

    if (lastEvaluatedKeyString) {
        params.ExclusiveStartKey = JSON.parse(lastEvaluatedKeyString);
    }

    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    };

    const job = await addJobToReadQueue(jobData);
    const response = await job.finished() as QueryCommandOutput;
    const items = response.Items || [];

    if (items && items.length > 0) {
        await updateCommentCounts(items);
        await getUserProfile(items);
        return {
            lastEvaluatedKey: response.LastEvaluatedKey,
            items: items
        };
    } else {
        const errorResponse = {
            Error: {
                Code: "NoTickets",
                Message: "Doesn't have a ticket in municipality",
            }
        };
        throw new Error(JSON.stringify(errorResponse));
    }
};

export const getOpenTicketsInMunicipality = async (municipality: string | null, cacheKey: string) => {
    const params: QueryCommandInput = {
        TableName: TICKETS_TABLE,
        IndexName: "municipality_id-dateOpened-index",
        KeyConditionExpression: "municipality_id = :municipality_id",
        FilterExpression: "#state = :state",
        ExpressionAttributeNames: {
            "#state": "state"
        },
        ExpressionAttributeValues: {
            ":municipality_id": municipality,
            ":state": "Opened"
        },
        ScanIndexForward: false, // sort in descending order (from most recent ticket to oldest)
    };

    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    };

    const job = await addJobToReadQueue(jobData);
    const response = await job.finished() as QueryCommandOutput;
    const items = response.Items;

    if (items && items.length > 0) {
        await updateCommentCounts(items);
        await getUserProfile(items);
        return items;
    } else {
        const errorResponse = {
            Error: {
                Code: "NoTickets",
                Message: "Doesn't have open tickets in municipality",
            },
        };
        throw new ClientError(errorResponse, "NoTicket");
    }
};

export const getWatchlist = async (userId: string, cacheKey: string, lastEvaluatedKeyString: string) => {
    const collective: any[] = [];

    const params: QueryCommandInput = {
        TableName: WATCHLIST_TABLE,
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
            ":user_id": userId
        },
        Limit: 15
    };

    if (lastEvaluatedKeyString) {
        params.ExclusiveStartKey = JSON.parse(lastEvaluatedKeyString);
    }

    const jobsData: JobData = {
        type: DB_QUERY,
        params: params
    };

    const job = await addJobToReadQueue(jobsData);
    const response = await job.finished() as QueryCommandOutput;

    const items = response.Items;

    if (items && items.length > 0) {
        for (const item of items) {
            const params2: QueryCommandInput = {
                TableName: TICKETS_TABLE,
                KeyConditionExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": item.ticket_id
                },
                ScanIndexForward: false, // sort in descending order (from most recent ticket to oldest)
            };

            const jobData2: JobData = {
                type: DB_QUERY,
                params: params2
            };

            const job2 = await addJobToReadQueue(jobData2, { priority: 1 });
            const respItem = await job2.finished() as QueryCommandOutput;
            const ticketsItems = respItem.Items;

            if (ticketsItems && ticketsItems.length > 0) {
                await updateCommentCounts(ticketsItems);
                await getUserProfile(ticketsItems);
                collective.push(...ticketsItems);
            }
        }
        return {
            lastEvaluatedKey: response.LastEvaluatedKey,
            items: collective
        };
    } else {
        throw new Error("NoWatchlist: Doesn't have a watchlist");
    }
};

export const viewTicketData = async (ticketId: string, cacheKey: string) => {
    try {
        validateTicketId(ticketId);
        const params: QueryCommandInput = {
            TableName: TICKETS_TABLE,
            KeyConditionExpression: "ticket_id = :ticket_id",
            ExpressionAttributeValues: {
                ":ticket_id": ticketId
            },
            ScanIndexForward: false, // sort in descending order (from most recent ticket to oldest)
        };

        const jobData: JobData = {
            type: DB_QUERY,
            params: params
        };

        const job = await addJobToReadQueue(jobData);
        const response = await job.finished() as QueryCommandOutput;
        const items = response.Items || [];

        if (items.length > 0) {
            await updateCommentCounts(items);
            await getUserProfile(items);
            return items;
        } else {
            const errorResponse = {
                Error: {
                    Code: "NoTickets",
                    Message: "Doesn't have ticket in municipality",
                },
            };
            throw new ClientError(errorResponse, "NoTicket");
        }
    } catch (e: any) {
        if (e instanceof ClientError) {
            throw new BadRequestError(`Failed to get Ticket data: ${e.response.Error.Message}`);
        }
        throw new BadRequestError(`Failed to get Ticket data: ${e.message}`);
    }
};

export const interactTicket = async (ticketData: any) => {
    invalidateCacheOnTicketUpdateOnly();

    const interactType = String(ticketData.type).toUpperCase();
    const params: QueryCommandInput = {
        TableName: TICKETS_TABLE,
        KeyConditionExpression: "ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":ticket_id": ticketData.ticket_id
        },
        ScanIndexForward: false, // sort in descending order (from most recent ticket to oldest)
    };

    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    };

    const job = await addJobToReadQueue(jobData);
    const response = await job.finished() as QueryCommandOutput;
    const items = response.Items || [];

    if (items.length > 0) {
        if (interactType === "UPVOTE") {
            for (const item of items) {
                const votes = Number(item.upvotes) + 1;
                const currentDatetime = new Date().toISOString();
                const updateParams: UpdateCommandInput = {
                    TableName: TICKETS_TABLE,
                    Key: {
                        ticket_id: item.ticket_id,
                        dateOpened: item.dateOpened
                    },
                    UpdateExpression: "SET upvotes = :votes, updatedAt = :updatedAt",
                    ExpressionAttributeValues: {
                        ":votes": votes,
                        ":updatedAt": currentDatetime
                    }
                };

                const updateJobData: JobData = {
                    type: DB_UPDATE,
                    params: updateParams
                };

                const updateJob = await addJobToWriteQueue(updateJobData, { priority: 1 });
                await updateJob.finished();
                return { Status: "SUCCESSFUL", vote: votes };
            }
        } else if (interactType === "VIEWED") {
            for (const item of items) {
                const views = Number(item.viewcount) + 1;
                const updateParams: UpdateCommandInput = {
                    TableName: TICKETS_TABLE,
                    Key: {
                        ticket_id: item.ticket_id,
                        dateOpened: item.dateOpened
                    },
                    UpdateExpression: "SET viewcount = :views",
                    ExpressionAttributeValues: {
                        ":views": views
                    }
                };

                const updateJobData: JobData = {
                    type: DB_UPDATE,
                    params: updateParams
                };

                const updateJob = await addJobToWriteQueue(updateJobData, { priority: 1 });
                await updateJob.finished();
                return { Status: "SUCCESSFUL", views: views };
            }
        } else if (interactType === "UNVOTE") {
            for (const item of items) {
                const votes = Number(item.upvotes) - 1;
                const updateParams: UpdateCommandInput = {
                    TableName: TICKETS_TABLE,
                    Key: {
                        ticket_id: item.ticket_id,
                        dateOpened: item.dateOpened
                    },
                    UpdateExpression: "SET upvotes = :votes",
                    ExpressionAttributeValues: {
                        ":votes": votes
                    }
                };
                const updateJobData: JobData = {
                    type: DB_UPDATE,
                    params: updateParams
                };

                const updateJob = await addJobToWriteQueue(updateJobData, { priority: 1 });
                await updateJob.finished();
                return { Status: "SUCCESSFUL", vote: votes };
            }
        }
    } else {
        const errorResponse = {
            Error: {
                Code: "TicketDoesntExist",
                Message: "Ticket doesn't exist",
            },
        };
        throw new ClientError(errorResponse, "NonExistence");
    }
};

export const getMostUpvoted = async (cacheKey: string, lastEvaluatedKeyArrayString: string) => {
    const params1: QueryCommandInput = {
        TableName: TICKETS_TABLE,
        IndexName: "state-upvotes-index",
        KeyConditionExpression: "#state = :state",
        ExpressionAttributeNames: {
            "#state": "state"
        },
        ExpressionAttributeValues: {
            ":state": "Opened"
        },
        ScanIndexForward: false, // sort in descending order
        Limit: 5 // limit result set to the top 5 items
    };

    const params2: QueryCommandInput = {
        TableName: TICKETS_TABLE,
        IndexName: "state-upvotes-index",
        KeyConditionExpression: "#state = :state",
        ExpressionAttributeNames: {
            "#state": "state"
        },
        ExpressionAttributeValues: {
            ":state": "In Progress"
        },
        ScanIndexForward: false, // sort in descending order
        Limit: 5 // limit result set to the top 5 items
    };

    const params3: QueryCommandInput = {
        TableName: TICKETS_TABLE,
        IndexName: "state-upvotes-index",
        KeyConditionExpression: "#state = :state",
        ExpressionAttributeNames: {
            "#state": "state"
        },
        ExpressionAttributeValues: {
            ":state": "Taking Tenders"
        },
        ScanIndexForward: false, // sort in descending order
        Limit: 5 // limit result set to the top 5 items
    };

    if (lastEvaluatedKeyArrayString) {
        const lastEvaluatedKeyMap = JSON.parse(lastEvaluatedKeyArrayString) as {
            one: Record<string, any> | undefined,
            two: Record<string, any> | undefined,
            three: Record<string, any> | undefined
        };

        params1.ExclusiveStartKey = lastEvaluatedKeyMap.one;
        params2.ExclusiveStartKey = lastEvaluatedKeyMap.two;
        params3.ExclusiveStartKey = lastEvaluatedKeyMap.three;
    }

    const jobData1: JobData = {
        type: DB_QUERY,
        params: params1
    };

    const jobData2: JobData = {
        type: DB_QUERY,
        params: params2
    };

    const jobData3: JobData = {
        type: DB_QUERY,
        params: params3
    };

    const job1 = await addJobToReadQueue(jobData1, { priority: 1 });
    const job2 = await addJobToReadQueue(jobData2, { priority: 1 });
    const job3 = await addJobToReadQueue(jobData3, { priority: 1 });

    const result1 = await job1.finished() as QueryCommandOutput;
    const result2 = await job2.finished() as QueryCommandOutput;
    const result3 = await job3.finished() as QueryCommandOutput;

    const items1: Ticket[] = result1.Items as Ticket[];
    const items2: Ticket[] = result2.Items as Ticket[];
    const items3: Ticket[] = result3.Items as Ticket[];

    const lastEvaluatedKeyMapOutput = {
        one: result1.LastEvaluatedKey,
        two: result2.LastEvaluatedKey,
        three: result3.LastEvaluatedKey
    };

    // combine the top items from each state to get a total of 16 items
    const topItems: Ticket[] = [...items1, ...items2, ...items3];

    if (topItems.length > 0) {
        // get the count of comments for each ticket
        await updateCommentCounts(topItems);
        await getUserProfile(topItems);
        return {
            lastEvaluatedKey: lastEvaluatedKeyMapOutput,
            items: topItems
        };
    } else {
        throw new Error("TicketDontExist: Seems tickets don't exist");
    }
};

export const closeTicket = async (ticketData: any) => {
    invalidateCacheOnTicketUpdateOnly();

    const ticketDateOpened = await getTicketDateOpened(ticketData.ticket_id);

    if (!ticketDateOpened) {
        const errorResponse = {
            Error: {
                Code: "TicketDoesntExist",
                Message: "Ticket doesn't exist",
            },
        };
        throw new ClientError(errorResponse, "TicketDoesntExist");
    }

    const ticketId = ticketData["ticket_id"];
    const updateExpression = "set #state = :r";
    const expressionAttributeNames = { "#state": "state" };
    const expressionAttributeValues = { ":r": "Closed" };

    const response = await updateTicketTable(
        ticketId,
        ticketDateOpened,
        updateExpression,
        expressionAttributeNames,
        expressionAttributeValues
    );

    const dateExpression = "set #dateClosed = :r";
    const closeExpressionAttributeNames = { "#dateClosed": "dateClosed" };
    const currentDatetime = new Date();
    const formattedDatetime = currentDatetime.toISOString();
    const closeExpressionAttributeValues = { ":r": formattedDatetime };

    const responseClosed = await updateTicketTable(
        ticketId,
        ticketDateOpened,
        dateExpression,
        closeExpressionAttributeNames,
        closeExpressionAttributeValues
    );

    if (response.$metadata) {
        return {
            Status: "Success",
            Ticket_id: ticketId,
        };
    } else {
        const errorResponse = {
            Error: {
                Code: "UpdateError",
                Message: "Error occurred while trying to update",
            },
        };
        throw new ClientError(errorResponse, "UpdateError");
    }
};

export const acceptTicket = async (ticketData: any) => {
    invalidateCacheOnTicketUpdateOnly();

    const ticketDateOpened = await getTicketDateOpened(ticketData.ticket_id);

    if (!ticketDateOpened) {
        const errorResponse = {
            Error: {
                Code: "TicketDoesntExist",
                Message: "Ticket doesn't exist",
            },
        };
        throw new ClientError(errorResponse, "TicketDoesntExist");
    }

    const ticketId = ticketData["ticket_id"];
    const currentDatetime = new Date().toISOString();
    const updateExpression = "set #state = :r, updatedAt = :updatedAt";
    const expressionAttributeNames = { "#state": "state" };
    const expressionAttributeValues = { ":r": "Taking Tenders", ":updatedAt": currentDatetime };

    const response = await updateTicketTable(
        ticketId,
        ticketDateOpened,
        updateExpression,
        expressionAttributeNames,
        expressionAttributeValues
    );

    if (response.$metadata) {
        return {
            Status: "Success",
            Ticket_id: ticketId,
        };
    } else {
        const errorResponse = {
            Error: {
                Code: "UpdateError",
                Message: "Error occurred while trying to update",
            },
        };
        throw new ClientError(errorResponse, "UpdateError");
    }
};

export const getCompanyTickets = async (companyname: string, cacheKey: string) => {
    const collective: any[] = [];
    const company_id = await getCompanyIDFromName(companyname);


    const params: QueryCommandInput = {
        TableName: TENDERS_TABLE,
        IndexName: "company_id-index",
        KeyConditionExpression: "company_id = :company_id",
        ExpressionAttributeValues: {
            ":company_id": company_id
        },
    };


    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    };

    const job = await addJobToReadQueue(jobData, { priority: 1 });
    const responseTender = await job.finished() as QueryCommandOutput

    const tenderItems = responseTender.Items;

    if (tenderItems && tenderItems.length > 0) {
        for (const item of tenderItems) {
            const params2: QueryCommandInput = {
                TableName: TICKETS_TABLE,
                KeyConditionExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": item["ticket_id"]
                },
                ScanIndexForward: false, // sort in descending order (from most recent ticket to oldest)
            };

            const jobData2: JobData = {
                type: DB_QUERY,
                params: params2
            };

            const job2 = await addJobToReadQueue(jobData2, { priority: 1 });
            const responseCompanyTickets = await job2.finished() as QueryCommandOutput;
            const companyTickets = responseCompanyTickets.Items;

            if (companyTickets && companyTickets.length > 0) {
                await getUserProfile(companyTickets);
                collective.push(...companyTickets);
            }
        }
    }

    const params3: QueryCommandInput = {
        TableName: TICKETS_TABLE,
        IndexName: "state-upvotes-index",
        KeyConditionExpression: "#state = :state",
        ExpressionAttributeNames: {
            "#state": "state"
        },
        ExpressionAttributeValues: {
            ":state": "Taking Tenders"
        },
        ScanIndexForward: false, // sort in descending order
        Limit: 16 // limit result set to the top 16 items
    };

    const jobData3: JobData = {
        type: DB_QUERY,
        params: params3
    };

    const job3 = await addJobToReadQueue(jobData3, { priority: 1 });
    const response = await job3.finished() as QueryCommandOutput;
    const topItems = response.Items || [];

    if (topItems.length > 0) {
        await updateCommentCounts(topItems);
        await getUserProfile(topItems);
        collective.push(...topItems);
        return collective;
    } else {
        const errorResponse = {
            Error: {
                Code: "TicketDontExist",
                Message: "Seems tickets don't exist",
            },
        };
        throw new ClientError(errorResponse, "NonExistence");
    }
};


export const getOpenCompanyTickets = async (cacheKey: string) => {
    const collective: any[] = [];

    const params: QueryCommandInput = {
        TableName: TICKETS_TABLE,
        IndexName: "state-updatedAt-index",
        KeyConditionExpression: "#state = :state",
        ExpressionAttributeNames: {
            "#state": "state"
        },
        ExpressionAttributeValues: {
            ":state": "Taking Tenders"
        },
        ScanIndexForward: false, // sort in descending order
        Limit: 16 // limit result set to the top 16 items
    };

    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    };

    const job = await addJobToReadQueue(jobData);
    const response = await job.finished() as QueryCommandOutput;
    const topItems = response.Items || [];

    if (topItems.length > 0) {
        await updateCommentCounts(topItems);
        await getUserProfile(topItems);
        return topItems;
    } else {
        const errorResponse = {
            Error: {
                Code: "TicketDontExist",
                Message: "Seems tickets don't exist",
            },
        };
        throw new ClientError(errorResponse, "NonExistence");
    }
};

export const addTicketCommentWithImage = async (comment: string, ticket_id: string, image_url: string, user_id: string) => {
    invalidateCacheOnTicketUpdateOnly();

    // Validate ticket_id
    validateTicketId(ticket_id);

    // Generate unique ticket update ID (just to keep track of the comments)
    const ticketupdate_id = generateId();

    // Get current date and time
    const currentDatetime = new Date();
    const formattedDatetime = currentDatetime.toISOString();

    // Prepare comment item
    const commentItem = {
        ticketupdate_id: ticketupdate_id,
        comment: comment,
        date: formattedDatetime,
        imageURL: image_url,
        ticket_id: ticket_id,
        user_id: user_id
    };

    // Insert comment into ticket_updates table
    const params: PutCommandInput = {
        TableName: TICKET_UPDATE_TABLE,
        Item: commentItem,
    };

    const jobData: JobData = {
        type: DB_PUT,
        params: params
    };

    const job = await addJobToWriteQueue(jobData);
    await job.finished();

    const response = {
        message: "Comment added successfully",
        ticketupdate_id: ticketupdate_id,
    };
    return response;
};

export const addTicketCommentWithoutImage = async (comment: string, ticket_id: string, user_id: string) => {
    // Validate ticket_id
    validateTicketId(ticket_id);

    // Generate unique ticket update ID
    const ticketupdate_id = generateId();

    // Get current date and time
    const currentDatetime = new Date();
    const formattedDatetime = currentDatetime.toISOString();

    // Prepare comment item
    const commentItem = {
        ticketupdate_id: ticketupdate_id,
        comment: comment,
        date: formattedDatetime,
        imageURL: "<empty>",  // Set to <empty> if no image is provided
        ticket_id: ticket_id,
        user_id: user_id
    };

    // Insert comment into ticket_updates table
    const params: PutCommandInput = {
        TableName: TICKET_UPDATE_TABLE,
        Item: commentItem,
    };

    const jobData: JobData = {
        type: DB_PUT,
        params: params
    };

    const job = await addJobToWriteQueue(jobData);
    await job.finished();

    const response = {
        message: "Comment added successfully",
        ticketupdate_id: ticketupdate_id,
    };

    return response;
};

export const getTicketComments = async (currTicketId: string, cacheKey: string) => {
    validateTicketId(currTicketId);
    try {
        const params: QueryCommandInput = {
            TableName: TICKET_UPDATE_TABLE,
            IndexName: "ticket_id-index",
            KeyConditionExpression: "ticket_id = :ticket_id",
            ExpressionAttributeValues: {
                ":ticket_id": currTicketId
            }
        };

        const jobData: JobData = {
            type: DB_QUERY,
            params: params
        };

        const job = await addJobToReadQueue(jobData);
        const response = await job.finished() as QueryCommandOutput;
        const items = response.Items || [];
        return items;
    } catch (e: any) {
        if (e instanceof ClientError) {
            throw new BadRequestError(`Failed to search for the ticket comments: ${e.response.Error.Message}`);
        }
        throw new BadRequestError(`Failed to search for the ticket comments: ${e.message}`);
    }
};

export const getGeodataAll = async (cacheKey: string) => {
    try {
        const params: ScanCommandInput = {
            TableName: TICKETS_TABLE,
            ProjectionExpression: "asset_id, latitude, longitude, upvotes"
        };

        const jobData: JobData = {
            type: DB_SCAN,
            params: params
        };
        const job = await addJobToReadQueue(jobData);
        const response = await job.finished() as ScanCommandOutput;
        const faultData = response.Items || [];

        for (const fault of faultData) {
            const upvotes = fault.upvotes || 0;

            if (upvotes < 10) {
                fault.urgency = "non-urgent";
            } else if (upvotes >= 10 && upvotes < 20) {
                fault.urgency = "semi-urgent";
            } else if (upvotes >= 20 && upvotes <= 40) {
                fault.urgency = "urgent";
            } else {
                fault.urgency = "non-urgent";
            }

            delete fault.upvotes;
        }

        return faultData;
    } catch (e: any) {
        if (e instanceof ClientError) {
            throw new BadRequestError(`Failed to retrieve all tickets: ${e.response.Error.Message}`);
        }
        throw new BadRequestError(`Failed to retrieve all tickets: ${e.message}`);
    }
};