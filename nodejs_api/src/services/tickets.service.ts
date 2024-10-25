import { QueryCommandInput, GetCommandInput, PutCommandInput, ScanCommandInput, UpdateCommandInput, GetCommand, PutCommand, QueryCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { BadRequestError, ClientError } from "../types/error.types";
import { ASSETS_TABLE, cognitoClient, dynamoDBDocumentClient, TENDERS_TABLE, TICKET_UPDATE_TABLE, TICKETS_TABLE, WATCHLIST_TABLE } from "../config/dynamodb.config";
import { generateId, generateTicketNumber, getCompanyIDFromName, getMunicipality, getTicketDateOpened, getUserProfile, updateCommentCounts, updateTicketTable, validateTicketId } from "../utils/tickets.utils";
import { uploadFile } from "../config/s3bucket.config";
import { deleteAllCache } from "../config/redis.config";
import { sendWebSocketMessage } from "../utils/tenders.utils";
import { AdminGetUserCommand, AdminGetUserCommandOutput } from "@aws-sdk/client-cognito-identity-provider";

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


export const createTicket = async (formData: any, file: Express.Multer.File | undefined) => {
    await deleteAllCache();

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

    const readCommand = new GetCommand(assetParams);
    const assetResponse = await dynamoDBDocumentClient.send(readCommand);

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

    // Put the ticket item into the tickets table
    const putCommand = new PutCommand(putItemParams);
    const putItemResponse = await dynamoDBDocumentClient.send(putCommand);


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

    const putWatchlistCommand = new PutCommand(putWatchlistParams);
    const watchlistResponse = await dynamoDBDocumentClient.send(putWatchlistCommand);

    // ----------------- update items in cache -----------------

    const message = JSON.stringify({ action: "createticket", body: municipalityId })
    await sendWebSocketMessage(message);

    // after accepting
    const accResponse = {
        message: "Ticket created successfully",
        ticket_id: ticketId,
        watchlist_id: watchlistId,
    };


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

    const readCommand = new QueryCommand(userExistsParams);
    const userExist = await dynamoDBDocumentClient.send(readCommand);

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

    const putCommand = new PutCommand(putItemParams);
    await dynamoDBDocumentClient.send(putCommand);

    return {
        Status: "Success",
        Message: `Ticket has been added to ${ticketData.username} with id of: ${watchlistId}`,
    };
};

export const getFaultTypes = async () => {
    const params: ScanCommandInput = {
        TableName: ASSETS_TABLE,
        ProjectionExpression: "asset_id, assetIcon, multiplier"
    };

    const scanCommand = new ScanCommand(params);
    const response = await dynamoDBDocumentClient.send(scanCommand);
    const assets = response.Items || [];

    const faultTypes = assets.map((asset: any) => ({
        asset_id: asset.asset_id,
        assetIcon: asset.assetIcon || "",
        multiplier: asset.multiplier || 1,
    }));

    return faultTypes;
};


export const getMyTickets = async (username: string | null) => {
    const params: QueryCommandInput = {
        TableName: TICKETS_TABLE,
        IndexName: "username-dateOpened-index",
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": username
        },
        ScanIndexForward: false, // sort in descending order (from most recent ticket to oldest)
    };

    const readCommand = new QueryCommand(params);
    const response = await dynamoDBDocumentClient.send(readCommand);
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

export const getInMyMunicipality = async (municipality: string | null, lastEvaluatedKeyString: string) => {
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

    const readCommand = new QueryCommand(params);
    const response = await dynamoDBDocumentClient.send(readCommand);
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

export const getOpenTicketsInMunicipality = async (municipality: string | null) => {
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

    const readCommand = new QueryCommand(params);
    const response = await dynamoDBDocumentClient.send(readCommand);
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

export const getWatchlist = async (userId: string, lastEvaluatedKeyString: string) => {
    const collective: any[] = [];

    const params: QueryCommandInput = {
        TableName: WATCHLIST_TABLE,
        IndexName: "user_id-ticket_id-index",
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
            ":user_id": userId
        },
        ProjectionExpression: "ticket_id",
        ScanIndexForward: false,
        Limit: 15
    };

    if (lastEvaluatedKeyString) {
        params.ExclusiveStartKey = JSON.parse(lastEvaluatedKeyString);
    }
    const readCommand = new QueryCommand(params);
    const response = await dynamoDBDocumentClient.send(readCommand);

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

            const queryCommand = new QueryCommand(params2);
            const response2 = await dynamoDBDocumentClient.send(queryCommand);

            const ticket = response2.Items || [];
            if (ticket.length > 0) {
                collective.push(ticket[0]);
            }
        }

        await updateCommentCounts(collective);
        await getUserProfile(collective);

        return {
            lastEvaluatedKey: response.LastEvaluatedKey,
            items: collective
        };
    } else {
        throw new Error("NoWatchlist: Doesn't have a watchlist");
    }
};

export const viewTicketData = async (ticketId: string) => {
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

        const readCommand = new QueryCommand(params);
        const response = await dynamoDBDocumentClient.send(readCommand);
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
    await deleteAllCache();

    const interactType = String(ticketData.type).toUpperCase();
    const params: QueryCommandInput = {
        TableName: TICKETS_TABLE,
        KeyConditionExpression: "ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":ticket_id": ticketData.ticket_id
        },
        ScanIndexForward: false, // sort in descending order (from most recent ticket to oldest)
    };

    const readCommand = new QueryCommand(params);
    const response = await dynamoDBDocumentClient.send(readCommand);
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

                const updateCommand = new UpdateCommand(updateParams);
                await dynamoDBDocumentClient.send(updateCommand);
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

                const updateCommand = new UpdateCommand(updateParams);
                await dynamoDBDocumentClient.send(updateCommand);
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

                const updateCommand = new UpdateCommand(updateParams);
                await dynamoDBDocumentClient.send(updateCommand);
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

export const getMostUpvoted = async (lastEvaluatedKeyArrayString: string) => {
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


    const readCommand1 = new QueryCommand(params1);
    const readCommand2 = new QueryCommand(params2);
    const readCommand3 = new QueryCommand(params3);

    const result1 = await dynamoDBDocumentClient.send(readCommand1);
    const result2 = await dynamoDBDocumentClient.send(readCommand2);
    const result3 = await dynamoDBDocumentClient.send(readCommand3);

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
    await deleteAllCache();

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
    await deleteAllCache();

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

export const getCompanyTickets = async (companyname: string) => {
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

    const readCommand = new QueryCommand(params);
    const responseTender = await dynamoDBDocumentClient.send(readCommand);

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

            const readCommand2 = new QueryCommand(params2);
            const responseCompanyTickets = await dynamoDBDocumentClient.send(readCommand2);
            const companyTickets = responseCompanyTickets.Items;

            if (companyTickets && companyTickets.length > 0) {
                collective.push(...companyTickets);
            }
        }

        await getUserProfile(collective);
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

    const readCommand3 = new QueryCommand(params3);
    const response = await dynamoDBDocumentClient.send(readCommand3);
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


export const getOpenCompanyTickets = async () => {
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

    const readCommand = new QueryCommand(params);
    const response = await dynamoDBDocumentClient.send(readCommand);
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
    await deleteAllCache();

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

    const putCommand = new PutCommand(params);
    await dynamoDBDocumentClient.send(putCommand);

    const response = {
        message: "Comment added successfully",
        ticketupdate_id: ticketupdate_id,
    };
    return response;
};

export const addTicketCommentWithoutImage = async (commentData: any) => {
    await deleteAllCache();

    // Validate ticket_id
    validateTicketId(commentData.ticket_id);

    // Generate unique ticket update ID
    const ticketupdate_id = generateId();

    // Prepare comment item
    const commentItem = {
        ticketupdate_id: ticketupdate_id,
        comment: commentData.comment,
        date: commentData.date_created,
        imageURL: "<empty>",  // Set to <empty> if no image is provided
        ticket_id: commentData.ticket_id,
        user_id: commentData.user_id
    };

    // Insert comment into ticket_updates table
    const params: PutCommandInput = {
        TableName: TICKET_UPDATE_TABLE,
        Item: commentItem,
    };

    const putCommand = new PutCommand(params);
    await dynamoDBDocumentClient.send(putCommand);

    const response = {
        message: "Comment added successfully",
        ticketupdate_id: ticketupdate_id
    };

    return response;
};

export const getTicketComments = async (currTicketId: string) => {
    validateTicketId(currTicketId);
    try {
        const params: QueryCommandInput = {
            TableName: TICKET_UPDATE_TABLE,
            IndexName: "ticket_id-index",
            KeyConditionExpression: "ticket_id = :ticket_id",
            ProjectionExpression: "ticketupdate_id, #comment, user_id, #date",
            ExpressionAttributeNames: {
                "#comment": "comment", // alias the reserved keyword "comment"
                "#date": "date"
            },
            ExpressionAttributeValues: {
                ":ticket_id": currTicketId
            }
        };

        const readCommand = new QueryCommand(params);
        const response = await dynamoDBDocumentClient.send(readCommand);
        const items = response.Items || [];

        if (items.length > 0) {
            let cognitoUsername: string = "";
            const USER_POOL_ID = process.env.USER_POOL_ID;
            const cognitoPromises = [];
            for (let commentItem of items) {
                cognitoUsername = (commentItem["user_id"] as string).toLowerCase();
                const response = cognitoClient.send(
                    new AdminGetUserCommand({
                        UserPoolId: USER_POOL_ID,
                        Username: cognitoUsername
                    })
                );

                cognitoPromises.push(response);
            }

            const userProfiles = await Promise.allSettled(cognitoPromises);

            userProfiles.forEach((result, index) => {
                if (result.status === "fulfilled") {
                    const userResponse = result.value as AdminGetUserCommandOutput;

                    let userImage: string | null = null;
                    let userGivenName: string | null = null;
                    let userFamilyName: string | null = null;

                    if (userResponse.UserAttributes) {
                        for (let attr of userResponse.UserAttributes) {
                            if (attr.Name === "picture") {
                                userImage = attr.Value || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";
                            }

                            if (attr.Name === "given_name") {
                                userGivenName = attr.Value!;
                            }

                            if (attr.Name === "family_name") {
                                userFamilyName = attr.Value!;
                            }

                            if (userImage && userGivenName && userFamilyName) {
                                break;
                            }
                        }
                    }

                    items[index]["userImage"] = userImage;
                    items[index]["userName"] = userGivenName + " " + userFamilyName;
                }
                else {
                    if (result.reason.name === "UserNotFoundException") {
                        items[index]["userImage"] = "";
                        items[index]["userName"] = "deleted_user";
                    }
                    else {
                        console.error("An error occurred:", result.reason);
                    }
                }
            });

            return items;
        }

    } catch (e: any) {
        if (e instanceof ClientError) {
            throw new BadRequestError(`Failed to search for the ticket comments: ${e.response.Error.Message}`);
        }
        throw new BadRequestError(`Failed to search for the ticket comments: ${e.message}`);
    }
};

export const getGeodataAll = async () => {
    try {
        const params: ScanCommandInput = {
            TableName: TICKETS_TABLE,
            ProjectionExpression: "asset_id, latitude, longitude, upvotes"
        };

        const readCommand = new ScanCommand(params);
        const response = await dynamoDBDocumentClient.send(readCommand);
        const faultData = response.Items || [];

        for (const fault of faultData) {
            const upvotes = fault.upvotes || 0;

            if (upvotes < 100) {
                fault.urgency = "non-urgent";
            } else if (upvotes >= 100 && upvotes < 400) {
                fault.urgency = "semi-urgent";
            } else if (upvotes >= 400) {
                fault.urgency = "urgent";
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