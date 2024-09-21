import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { ScanCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { BadRequestError, ClientError } from "../types/error.types";
import { ASSETS_TABLE, dynamoDBClient, TENDERS_TABLE, TICKET_UPDATE_TABLE, TICKETS_TABLE, WATCHLIST_TABLE } from "../config/dynamodb.config";
import { doesTicketExist, formatResponse, generateId, getCompanyIDFromName, getUserProfile, updateTicketTable, validateTicketId } from "../utils/tickets.utils";


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

    const userExistCommand = new ScanCommand({
        TableName: WATCHLIST_TABLE,
        FilterExpression: "user_id = :username AND ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":username": { S: ticketData.username },
            ":ticket_id": { S: ticketData.ticket_id },
        },
    });

    const userExist = await dynamoDBClient.send(userExistCommand);
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
        watchlist_id: { S: watchlistId },
        ticket_id: { S: ticketData.ticket_id },
        user_id: { S: ticketData.username },
    };

    const putItemCommand = new PutItemCommand({
        TableName: WATCHLIST_TABLE,
        Item: watchlistItem,
    });

    await dynamoDBClient.send(putItemCommand);

    return {
        Status: "Success",
        Message: `Ticket has been added to ${ticketData.username} with id of: ${watchlistId}`,
    };
};

export const getFaultTypes = async () => {
    const response = await dynamoDBClient.send(new ScanCommand({ TableName: ASSETS_TABLE }));
    const assets = response.Items || [];

    const faultTypes = assets.map((asset: any) => ({
        asset_id: asset.asset_id,
        assetIcon: asset.assetIcon || "",
        multiplier: asset.multiplier || 1,
    }));

    // return formatResponse(200, faultTypes);
    return faultTypes;
};


export const getMyTickets = async (tickets_data: string | null) => {
    if (!tickets_data) {
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
            ":username": { S: tickets_data },
        },
    });

    const response = await dynamoDBClient.send(queryCommand);
    const items = response.Items;

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

    const response = await dynamoDBClient.send(queryCommand);
    const items = response.Items;

    if (items && items.length > 0) {
        for (const item of items) {
            const updateCommand = new QueryCommand({
                TableName: TICKET_UPDATE_TABLE,
                IndexName: "ticket_id-index",
                KeyConditionExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": item.ticket_id
                },
                Select: "COUNT"
            });

            const queryResponse = await dynamoDBClient.send(updateCommand);
            item.commentcount = queryResponse.Count || 0;
        }

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

export const getOpenTicketsInMunicipality = async (ticketsData: string | null) => {
    if (!ticketsData) {
        const errorResponse = {
            Error: {
                Code: "IncorrectFields",
                Message: "Missing required field: municipality",
            },
        };
        throw new ClientError(errorResponse, "InvalidFields");
    }

    const response = await dynamoDBClient.send(
        new QueryCommand({
            TableName: TICKETS_TABLE,
            IndexName: "municipality_id-index",
            KeyConditionExpression: "municipality_id = :municipality_id",
            ExpressionAttributeValues: {
                ":municipality_id": ticketsData,
            },
        })
    );
    const items = response.Items;

    if (items && items.length > 0) {
        for (const item of items) {
            const responseItem = await dynamoDBClient.send(
                new QueryCommand({
                    TableName: TICKET_UPDATE_TABLE,
                    IndexName: "ticket_id-index",
                    KeyConditionExpression: "ticket_id = :ticket_id",
                    ExpressionAttributeValues: {
                        ":ticket_id": item.ticket_id,
                    },
                })
            );
            item.commentcount = responseItem.Count || 0;
        }

        await getUserProfile(items);
        const filteredItems = items.filter((item) => item.state === "Opened");

        if (filteredItems.length <= 0) {
            const errorResponse = {
                Error: {
                    Code: "NoTickets",
                    Message: "Doesn't have open tickets in municipality",
                },
            };
            throw new ClientError(errorResponse, "NoTicket");
        }

        return filteredItems;
    } else {
        const errorResponse = {
            Error: {
                Code: "NoTickets",
                Message: "Doesn't have ticket in municipality",
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

    const scanParams = {
        TableName: WATCHLIST_TABLE,
        FilterExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
            ":user_id": userId.toLowerCase()
        }
    };

    const scanCommand = new ScanCommand(scanParams);
    const response = await dynamoDBClient.send(scanCommand);
    const items = response.Items;

    if (items && items.length > 0) {
        for (const item of items) {
            const queryParams = {
                TableName: TICKETS_TABLE,
                KeyConditionExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": item.ticket_id
                }
            };

            const queryCommand = new QueryCommand(queryParams);
            const respItem = await dynamoDBClient.send(queryCommand);
            const ticketsItems = respItem.Items;

            if (ticketsItems && ticketsItems.length > 0) {
                for (const tckItem of ticketsItems) {
                    const updateCommand = new QueryCommand({
                        TableName: TICKET_UPDATE_TABLE,
                        IndexName: "ticket_id-index",
                        KeyConditionExpression: "ticket_id = :ticket_id",
                        ExpressionAttributeValues: {
                            ":ticket_id": tckItem.ticket_id
                        },
                        Select: "COUNT"
                    });

                    const queryResponse = await dynamoDBClient.send(updateCommand);
                    tckItem.commentcount = queryResponse.Count || 0;
                }
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
        const response = await dynamoDBClient.send(
            new QueryCommand({
                TableName: TICKETS_TABLE,
                KeyConditionExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": ticketId,
                },
            })
        );
        const items = response.Items || [];

        if (items.length > 0) {
            for (const item of items) {
                const responseItem = await dynamoDBClient.send(
                    new QueryCommand({
                        TableName: TICKET_UPDATE_TABLE,
                        IndexName: "ticket_id-index",
                        KeyConditionExpression: "ticket_id = :ticket_id",
                        ExpressionAttributeValues: {
                            ":ticket_id": item.ticket_id,
                        },
                    })
                );
                item.commentcount = responseItem.Count || 0;
            }
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
        const response = await dynamoDBClient.send(
            new QueryCommand({
                TableName: TICKETS_TABLE,
                ProjectionExpression: "upvotes, viewcount",
                KeyConditionExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": ticketData.ticket_id,
                },
            })
        );
        const items = response.Items || [];

        if (items.length > 0) {
            if (interactType === "UPVOTE") {
                for (const item of items) {
                    const votes = Number(item.upvotes) + 1;
                    await dynamoDBClient.send(
                        new UpdateCommand({
                            TableName: TICKETS_TABLE,
                            Key: {
                                ticket_id: item.ticket_id,
                            },
                            UpdateExpression: "SET upvotes = :votes",
                            ExpressionAttributeValues: {
                                ":votes": votes,
                            },
                        })
                    );
                    return { Status: "SUCCESSFUL", vote: votes };
                }
            } else if (interactType === "VIEWED") {
                for (const item of items) {
                    const views = Number(item.viewcount) + 1;
                    await dynamoDBClient.send(
                        new UpdateCommand({
                            TableName: TICKETS_TABLE,
                            Key: {
                                ticket_id: item.ticket_id,
                            },
                            UpdateExpression: "SET viewcount = :views",
                            ExpressionAttributeValues: {
                                ":views": views,
                            },
                        })
                    );
                    return { Status: "SUCCESSFUL", views: views };
                }
            } else if (interactType === "UNVOTE") {
                for (const item of items) {
                    const votes = Number(item.upvotes) - 1;
                    await dynamoDBClient.send(
                        new UpdateCommand({
                            TableName: TICKETS_TABLE,
                            Key: {
                                ticket_id: item.ticket_id,
                            },
                            UpdateExpression: "SET upvotes = :votes",
                            ExpressionAttributeValues: {
                                ":votes": votes,
                            },
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
        // const upvotesQueryCommand = new QueryCommand({
        //     TableName: TICKETS_TABLE,
        //     IndexName: "upvotes-index",
        //     KeyConditionExpression: "upvotes <> :minUpvotes",
        //     ExpressionAttributeValues: {
        //         ":minUpvotes": 0
        //     },
        //     ScanIndexForward: false, // Descending order
        //     Limit: 15
        // });

        // const response = await dynamoDBClient.send(upvotesQueryCommand);
        // const topItems: Ticket[] = response.Items as Ticket[];


        // Scan tickets_table to get items with "upvotes" attribute
        const scanCommand = new ScanCommand({
            TableName: TICKETS_TABLE,
            FilterExpression: "attribute_exists(upvotes)"
        });
        const response = await dynamoDBClient.send(scanCommand);
        const items: Ticket[] = response.Items as Ticket[];

        // Sort items by "upvotes" in descending order and get the top 15
        const sortedItems = items.sort((a, b) => b.upvotes - a.upvotes);
        const topItems = sortedItems.slice(0, 15);

        if (topItems.length > 0) {
            for (const item of topItems) {
                // Query ticketupdate_table to get the count of comments for each ticket
                const queryCommand = new QueryCommand({
                    TableName: TICKET_UPDATE_TABLE,
                    IndexName: "ticket_id-index",
                    KeyConditionExpression: "ticket_id = :ticket_id",
                    ExpressionAttributeValues: {
                        ":ticket_id": item.ticket_id
                    },
                    Select: "COUNT"
                });
                const queryResponse = await dynamoDBClient.send(queryCommand);
                item.commentcount = queryResponse.Count || 0;
            }

            // // Prepare to batch query for comment counts
            // const ticketIds = topItems.map(item => item.ticket_id);
            // const batchGetCommand = new BatchGetItemCommand({
            //     RequestItems: {
            //         TICKET_UPDATE_TABLE: {
            //             Keys: ticketIds.map(ticket_id => ({
            //                 ticket_id: { S: ticket_id }
            //             })),
            //             ProjectionExpression: "ticket_id" // Get only necessary attributes
            //         }
            //     }
            // });
            // const batchResponse = await dynamoDBClient.send(batchGetCommand);
            // const commentCounts = new Map<string, number>();

            // // Aggregate comment counts
            // batchResponse.Responses?.TICKET_UPDATE_TABLE.forEach(item => {
            //     const ticket_id = item.ticket_id.S;
            //     if (ticket_id) {
            //         commentCounts.set(ticket_id, (commentCounts.get(ticket_id) || 0) + 1);
            //     }
            // });

            // // Attach comment counts to top items
            // topItems.forEach(item => {
            //     item.commentcount = commentCounts.get(item.ticket_id) || 0;
            // });

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


export const getCompanyTickets = async (companyname: string | null): Promise<any> => {
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

    const responseTender = await dynamoDBClient.send(new ScanCommand({
        TableName: TENDERS_TABLE,
        FilterExpression: "company_id = :company_id",
        ExpressionAttributeValues: {
            ":company_id": { S: company_id },
        },
    }));

    const tenderItems = responseTender.Items;

    if (tenderItems && tenderItems.length > 0) {
        for (const item of tenderItems) {
            const responseCompanyTickets = await dynamoDBClient.send(new QueryCommand({
                TableName: TICKETS_TABLE,
                KeyConditionExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": { S: item["ticket_id"].S },
                },
            }));

            const companyTickets = responseCompanyTickets.Items;

            if (companyTickets && companyTickets.length > 0) {
                await getUserProfile(companyTickets);
                collective.push(...companyTickets);
            }
        }
    }

    const response = await dynamoDBClient.send(new ScanCommand({
        TableName: TICKETS_TABLE,
        FilterExpression: "attribute_exists(upvotes)",
    }));

    const items = response.Items!;
    const sortedItems = items.sort((a, b) => b["upvotes"].N - a["upvotes"].N);
    const filteredItems = sortedItems.filter(item => item["state"].S === "Taking Tenders");
    const topItems = filteredItems.slice(0, 6);

    if (topItems.length > 0) {
        for (const item of topItems) {
            const responseItem = await dynamoDBClient.send(new ScanCommand({
                TableName: TICKET_UPDATE_TABLE,
                FilterExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": { S: item["ticket_id"].S },
                },
            }));

            item.commentcount = responseItem.Count || 0;
        }
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

    const response = await dynamoDBClient.send(new ScanCommand({
        TableName: TICKETS_TABLE,
        FilterExpression: "attribute_exists(upvotes)",
    }));

    const items = response.Items || [];
    const sortedItems = items.sort((a, b) => b["upvotes"].N - a["upvotes"].N);
    const filteredItems = sortedItems.filter(item => item["state"].S === "Taking Tenders");
    const topItems = filteredItems.slice(0, 6);

    if (topItems.length > 0) {
        for (const item of topItems) {
            const responseItem = await dynamoDBClient.send(new QueryCommand({
                TableName: TICKET_UPDATE_TABLE,
                IndexName: "ticket_id-index",
                KeyConditionExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": { S: item["ticket_id"].S },
                },
            }));

            item["commentcount"] = responseItem.Count || 0;
        }
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
        ticketupdate_id: { S: ticketupdate_id },
        comment: { S: comment },
        date: { S: formattedDatetime },
        imageURL: { S: image_url },
        ticket_id: { S: ticket_id },
        user_id: { S: user_id },
    };

    // Insert comment into ticket_updates table
    const putItemCommand = new PutItemCommand({
        TableName: TICKET_UPDATE_TABLE,
        Item: commentItem,
    });

    await dynamoDBClient.send(putItemCommand);

    const response = {
        message: "Comment added successfully",
        ticketupdate_id: ticketupdate_id,
    };
    return formatResponse(200, response);
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
        ticketupdate_id: { S: ticketupdate_id },
        comment: { S: comment },
        date: { S: formattedDatetime },
        imageURL: { S: "<empty>" },  // Set to <empty> if no image is provided
        ticket_id: { S: ticket_id },
        user_id: { S: user_id },
    };

    // Insert comment into ticket_updates table
    const putItemCommand = new PutItemCommand({
        TableName: TICKET_UPDATE_TABLE,
        Item: commentItem,
    });

    await dynamoDBClient.send(putItemCommand);

    const response = {
        message: "Comment added successfully",
        ticketupdate_id: ticketupdate_id,
    };
    return formatResponse(200, response);
};


export const getTicketComments = async (currTicketId: string) => {
    currTicketId = validateTicketId(currTicketId);
    try {
        const response = await dynamoDBClient.send(new ScanCommand({
            TableName: TICKET_UPDATE_TABLE,
        }));
        const items = response.Items || [];
        const filteredItems = items.filter(item =>
            currTicketId.toLowerCase() === item.ticket_id.S.toLowerCase()
        );
        return filteredItems;
    } catch (e: any) {
        if (e instanceof ClientError) {
            throw new BadRequestError(`Failed to search for the ticket comments: ${e.response.Error.Message}`);
        }
        throw new BadRequestError(`Failed to search for the ticket comments: ${e.message}`);
    }
};


export const getGeodataAll = async () => {
    try {
        const response = await dynamoDBClient.send(new ScanCommand({
            TableName: TICKETS_TABLE,
            ProjectionExpression: "asset_id, latitude, longitude, upvotes"
        }));
        const faultData = response.Items || [];

        for (const fault of faultData) {
            const upvotes = fault.upvotes.N;

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

