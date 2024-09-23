import { ScanCommand, QueryCommand, UpdateCommand, QueryCommandInput, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { BadRequestError, ClientError } from "../types/error.types";
import { ASSETS_TABLE, dynamoDBDocumentClient, TENDERS_TABLE, TICKET_UPDATE_TABLE, TICKETS_TABLE, WATCHLIST_TABLE } from "../config/dynamodb.config";
import { capitaliseUserEmail, doesTicketExist, generateId, generateTicketNumber, getCompanyIDFromName, getMunicipality, getUserProfile, updateCommentCounts, updateTicketTable, validateTicketId } from "../utils/tickets.utils";
import { uploadFile } from "../config/s3bucket.config";

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


export const createTicket = async (formData: any, file: Express.Multer.File) => {
    try {
        // Validate required fields
        const requiredFields = [
            "address",
            "asset",
            "description",
            "latitude",
            "longitude",
            "state",
            "username",
        ];

        for (const field of requiredFields) {
            const reqField = formData[field];
            if (!reqField) {
                const errorResponse = {
                    Error: {
                        Code: "IncorrectFields",
                        Message: `Missing required field: ${field}`,
                    },
                };
                throw new ClientError(errorResponse, "InvalidFields");
            }
        }

        const username = formData["username"] as string;
        const imageLink = await uploadFile("ticket_images", username, file);

        // Ensure asset exists
        const assetId = String(formData.asset);
        const assetResponse = await dynamoDBDocumentClient.send(new GetCommand({
            TableName: ASSETS_TABLE,
            Key: { asset_id: assetId },
        }));

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
        };

        // Put the ticket item into the tickets table
        await dynamoDBDocumentClient.send(new PutCommand({
            TableName: TICKETS_TABLE,
            Item: ticketItem,
        }));

        // Put ticket on their watchlist
        const watchlistId = generateId();

        const watchlistItem = {
            watchlist_id: watchlistId,
            ticket_id: ticketId,
            user_id: formData.username,
        };

        await dynamoDBDocumentClient.send(new PutCommand({
            TableName: WATCHLIST_TABLE,
            Item: watchlistItem,
        }));

        // After accepting
        const accResponse = {
            message: "Ticket created successfully",
            ticket_id: ticketId,
            watchlist_id: watchlistId,
        };

        return accResponse;

    } catch (error: any) {
        throw error;
    }
};

export const addWatchlist = async (ticketData: TicketData) => {
    const requiredFields = ["username", "ticket_id"];
    for (const field of requiredFields) {
        if (!(field in ticketData)) {
            const errorResponse = {
                Error: {
                    Code: "IncorrectFields",
                    Message: `Missing required field: ${field}`,
                },
            };
            throw new ClientError(errorResponse, "InvalidFields");
        }
    }

    const userExistCommand = new QueryCommand({
        TableName: WATCHLIST_TABLE,
        KeyConditionExpression: "user_id = :username",
        FilterExpression: "ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":username": ticketData.username,
            ":ticket_id": ticketData.ticket_id
        },
    });

    const userExist = await dynamoDBDocumentClient.send(userExistCommand);
    if (userExist.Items && userExist.Items.length > 0) {
        const errorResponse = {
            Error: {
                Code: "AlreadyExists",
                Message: "Already have ticket in watchlist",
            },
        };
        throw new ClientError(errorResponse, "AlreadyExists");
    }

    if (!(await doesTicketExist(ticketData.ticket_id))) {
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
        watchlist_id: watchlistId,
        ticket_id: ticketData.ticket_id,
        user_id: ticketData.username
    };

    const putItemCommand = new PutCommand({
        TableName: WATCHLIST_TABLE,
        Item: watchlistItem,
    });

    await dynamoDBDocumentClient.send(putItemCommand);

    return {
        Status: "Success",
        Message: `Ticket has been added to ${ticketData.username} with id of: ${watchlistId}`,
    };
};

export const getFaultTypes = async () => {
    const response = await dynamoDBDocumentClient.send(new ScanCommand({ TableName: ASSETS_TABLE }));
    const assets = response.Items || [];

    const faultTypes = assets.map((asset: any) => ({
        asset_id: asset.asset_id,
        assetIcon: asset.assetIcon || "",
        multiplier: asset.multiplier || 1,
    }));

    return faultTypes;
};


export const getMyTickets = async (username: string | null) => {
    if (!username) {
        const errorResponse = {
            Error: {
                Code: "IncorrectFields",
                Message: "Missing required field: username",
            },
        };
        throw new ClientError(errorResponse, "InvalidFields");
    }

    const queryCommand = new QueryCommand({
        TableName: TICKETS_TABLE,
        IndexName: "username-index",
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": capitaliseUserEmail(username)
        },
    });

    const response = await dynamoDBDocumentClient.send(queryCommand);
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

export const getInMyMunicipality = async (municipality: string | null) => {
    if (!municipality) {
        const errorResponse = {
            Error: {
                Code: "IncorrectFields",
                Message: "Missing required field: municipality",
            }
        };
        throw new Error(JSON.stringify(errorResponse));
    }

    const queryCommand = new QueryCommand({
        TableName: TICKETS_TABLE,
        IndexName: "municipality_id-index",
        KeyConditionExpression: "municipality_id = :municipality_id",
        ExpressionAttributeValues: {
            ":municipality_id": municipality
        }
    });

    const response = await dynamoDBDocumentClient.send(queryCommand);
    const items = response.Items || [];

    if (items && items.length > 0) {
        await updateCommentCounts(items);
        await getUserProfile(items);
        return items;
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
    if (!municipality) {
        const errorResponse = {
            Error: {
                Code: "IncorrectFields",
                Message: "Missing required field: municipality",
            },
        };
        throw new ClientError(errorResponse, "InvalidFields");
    }

    const response = await dynamoDBDocumentClient.send(
        new QueryCommand({
            TableName: TICKETS_TABLE,
            IndexName: "municipality_id-index",
            KeyConditionExpression: "municipality_id = :municipality_id",
            FilterExpression: "#state = :state",
            ExpressionAttributeNames: {
                "#state": "state"
            },
            ExpressionAttributeValues: {
                ":municipality_id": municipality,
                ":state": "Opened"
            },
        })
    );
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

export const getWatchlist = async (userId: string) => {
    const collective: any[] = [];

    if (!userId) {
        throw new Error("IncorrectFields: Missing required query: username");
    }

    const response = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: WATCHLIST_TABLE,
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
            ":user_id": capitaliseUserEmail(userId)
        }
    }));

    const items = response.Items;

    if (items && items.length > 0) {
        for (const item of items) {
            const queryCommand = new QueryCommand({
                TableName: TICKETS_TABLE,
                KeyConditionExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": item.ticket_id
                }
            });
            const respItem = await dynamoDBDocumentClient.send(queryCommand);
            const ticketsItems = respItem.Items;

            if (ticketsItems && ticketsItems.length > 0) {
                await updateCommentCounts(ticketsItems);
            } else {
                const errorResponse = {
                    Error: {
                        Code: "Inconsistency",
                        Message: "Inconsistency in ticket_id",
                    }
                };
                throw new Error(JSON.stringify(errorResponse));
            }

            await getUserProfile(ticketsItems);
            collective.push(...ticketsItems);
        }
        return collective;
    } else {
        throw new Error("NoWatchlist: Doesn't have a watchlist");
    }
};

export const viewTicketData = async (ticketId: string) => {
    try {
        ticketId = validateTicketId(ticketId);
        const response = await dynamoDBDocumentClient.send(
            new QueryCommand({
                TableName: TICKETS_TABLE,
                KeyConditionExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": ticketId
                },
            })
        );
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
    try {
        const requiredFields = ["type", "ticket_id"];
        for (const field of requiredFields) {
            if (!(field in ticketData)) {
                const errorResponse = {
                    Error: {
                        Code: "IncorrectFields",
                        Message: `Missing required field: ${field}`,
                    },
                };
                throw new ClientError(errorResponse, "InvalidFields");
            }
        }

        const interactType = String(ticketData.type).toUpperCase();
        const response = await dynamoDBDocumentClient.send(
            new QueryCommand({
                TableName: TICKETS_TABLE,
                ProjectionExpression: "upvotes, viewcount",
                KeyConditionExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": ticketData.ticket_id
                },
            })
        );
        const items = response.Items || [];

        if (items.length > 0) {
            if (interactType === "UPVOTE") {
                for (const item of items) {
                    const votes = Number(item.upvotes) + 1;
                    await dynamoDBDocumentClient.send(
                        new UpdateCommand({
                            TableName: TICKETS_TABLE,
                            Key: {
                                ticket_id: item.ticket_id
                            },
                            UpdateExpression: "SET upvotes = :votes",
                            ExpressionAttributeValues: {
                                ":votes": votes
                            }
                        })
                    );
                    return { Status: "SUCCESSFUL", vote: votes };
                }
            } else if (interactType === "VIEWED") {
                for (const item of items) {
                    const views = Number(item.viewcount) + 1;
                    await dynamoDBDocumentClient.send(
                        new UpdateCommand({
                            TableName: TICKETS_TABLE,
                            Key: {
                                ticket_id: item.ticket_id
                            },
                            UpdateExpression: "SET viewcount = :views",
                            ExpressionAttributeValues: {
                                ":views": views
                            }
                        })
                    );
                    return { Status: "SUCCESSFUL", views: views };
                }
            } else if (interactType === "UNVOTE") {
                for (const item of items) {
                    const votes = Number(item.upvotes) - 1;
                    await dynamoDBDocumentClient.send(
                        new UpdateCommand({
                            TableName: TICKETS_TABLE,
                            Key: {
                                ticket_id: item.ticket_id
                            },
                            UpdateExpression: "SET upvotes = :votes",
                            ExpressionAttributeValues: {
                                ":votes": votes
                            }
                        })
                    );
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
    } catch (e: any) {
        throw e;
    }
};

export const getMostUpvoted = async () => {
    try {
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
            Limit: 6 // limit result set to the top 6 items
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

        const [result1, result2, result3] = await Promise.all([
            dynamoDBDocumentClient.send(new QueryCommand(params1)),
            dynamoDBDocumentClient.send(new QueryCommand(params2)),
            dynamoDBDocumentClient.send(new QueryCommand(params3)),
        ]);

        const items1: Ticket[] = result1.Items as Ticket[];
        const items2: Ticket[] = result2.Items as Ticket[];
        const items3: Ticket[] = result3.Items as Ticket[];

        // combine the top items from each state to get a total of 16 items
        const topItems: Ticket[] = [...items1, ...items2, ...items3];

        if (topItems.length > 0) {
            // get the count of comments for each ticket
            await updateCommentCounts(topItems);
            await getUserProfile(topItems);
            return topItems;
        } else {
            throw new Error("TicketDontExist: Seems tickets don't exist");
        }
    } catch (error: any) {
        throw error;
    }
};

export const closeTicket = async (ticketData: any) => {
    const requiredFields = ["ticket_id"];

    for (const field of requiredFields) {
        if (!(field in ticketData)) {
            const errorResponse = {
                Error: {
                    Code: "IncorrectFields",
                    Message: `Missing required field: ${field}`,
                },
            };
            throw new ClientError(errorResponse, "InvalidFields");
        }
    }

    if (!(await doesTicketExist(ticketData.ticket_id))) {
        const errorResponse = {
            Error: {
                Code: "TicketDoesntExist",
                Message: "Ticket doesn't exist",
            },
        };
        throw new ClientError(errorResponse, "TicketDoesntExist");
    }

    const ticketId = ticketData.ticket_id;
    const updateExpression = "set #state = :r";
    const expressionAttributeNames = { "#state": "state" };
    const expressionAttributeValues = { ":r": "Closed" };

    const response = await updateTicketTable(
        ticketId,
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
    const requiredFields = ["ticket_id"];

    for (const field of requiredFields) {
        if (!(field in ticketData)) {
            const errorResponse = {
                Error: {
                    Code: "IncorrectFields",
                    Message: `Missing required field: ${field}`,
                },
            };
            throw new ClientError(errorResponse, "InvalidFields");
        }
    }

    if (!(await doesTicketExist(ticketData.ticket_id))) {
        const errorResponse = {
            Error: {
                Code: "TicketDoesntExist",
                Message: "Ticket doesn't exist",
            },
        };
        throw new ClientError(errorResponse, "TicketDoesntExist");
    }

    const ticketId = ticketData.ticket_id;
    const updateExpression = "set #state = :r";
    const expressionAttributeNames = { "#state": "state" };
    const expressionAttributeValues = { ":r": "Taking Tenders" };

    const response = await updateTicketTable(
        ticketId,
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

export const getCompanyTickets = async (companyname: string | null) => {
    if (!companyname) {
        const errorResponse = {
            Error: {
                Code: "IncorrectFields",
                Message: "Missing required query: company",
            },
        };
        throw new ClientError(errorResponse, "InvalidFields");
    }

    const collective: any[] = [];
    const company_id = await getCompanyIDFromName(companyname);

    const responseTender = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: TENDERS_TABLE,
        IndexName: "company_id-index",
        KeyConditionExpression: "company_id = :company_id",
        ExpressionAttributeValues: {
            ":company_id": company_id
        },
    }));

    const tenderItems = responseTender.Items;

    if (tenderItems && tenderItems.length > 0) {
        for (const item of tenderItems) {
            const responseCompanyTickets = await dynamoDBDocumentClient.send(new QueryCommand({
                TableName: TICKETS_TABLE,
                KeyConditionExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": item["ticket_id"]
                },
            }));

            const companyTickets = responseCompanyTickets.Items;

            if (companyTickets && companyTickets.length > 0) {
                await getUserProfile(companyTickets);
                collective.push(...companyTickets);
            }
        }
    }

    const response = await dynamoDBDocumentClient.send(new QueryCommand({
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
        Limit: 6 // limit result set to the top 6 items
    }));

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


export const getOpenCompanyTickets = async (): Promise<any> => {
    const collective: any[] = [];

    const response = await dynamoDBDocumentClient.send(new QueryCommand({
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
        Limit: 6 // limit result set to the top 6 items
    }));

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
    // Validate required fields
    if (!comment || !ticket_id || !image_url || !user_id) {
        const errorResponse = {
            Error: {
                Code: "IncorrectFields",
                Message: "Missing required field: comment, ticket_id, or image_url",
            },
        };
        throw new ClientError(errorResponse, "InvalidFields");
    }

    // Validate ticket_id
    ticket_id = validateTicketId(ticket_id);

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
    const putItemCommand = new PutCommand({
        TableName: TICKET_UPDATE_TABLE,
        Item: commentItem,
    });

    await dynamoDBDocumentClient.send(putItemCommand);

    const response = {
        message: "Comment added successfully",
        ticketupdate_id: ticketupdate_id,
    };
    return response;
};

export const addTicketCommentWithoutImage = async (comment: string, ticket_id: string, user_id: string) => {
    // Validate required fields
    if (!comment || !ticket_id || !user_id) {
        const errorResponse = {
            Error: {
                Code: "IncorrectFields",
                Message: "Missing required field: comment or ticket_id",
            },
        };
        throw new ClientError(errorResponse, "InvalidFields");
    }

    // Validate ticket_id
    ticket_id = validateTicketId(ticket_id);

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
    const putItemCommand = new PutCommand({
        TableName: TICKET_UPDATE_TABLE,
        Item: commentItem,
    });

    await dynamoDBDocumentClient.send(putItemCommand);

    const response = {
        message: "Comment added successfully",
        ticketupdate_id: ticketupdate_id,
    };

    return response;
};

export const getTicketComments = async (currTicketId: string) => {
    currTicketId = validateTicketId(currTicketId);
    try {
        const response = await dynamoDBDocumentClient.send(new QueryCommand({
            TableName: TICKET_UPDATE_TABLE,
            IndexName: "ticket_id-index",
            KeyConditionExpression: "ticket_id = :ticket_id",
            ExpressionAttributeValues: {
                ":ticket_id": currTicketId
            }
        }));

        const items = response.Items || [];
        return items;
    } catch (e: any) {
        if (e instanceof ClientError) {
            throw new BadRequestError(`Failed to search for the ticket comments: ${e.response.Error.Message}`);
        }
        throw new BadRequestError(`Failed to search for the ticket comments: ${e.message}`);
    }
};

export const getGeodataAll = async () => {
    try {
        const response = await dynamoDBDocumentClient.send(new ScanCommand({
            TableName: TICKETS_TABLE,
            ProjectionExpression: "asset_id, latitude, longitude, upvotes"
        }));
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