import { AdminGetUserCommand, AdminGetUserCommandOutput, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { BatchGetItemCommand, DynamoDBClient, GetItemCommand, Select } from "@aws-sdk/client-dynamodb";
import { ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const cognitoClient = new CognitoIdentityProviderClient({ region: "eu-west-1" });
const dynamoDBClient = new DynamoDBClient({ region: "eu-west-1" });

const ticketsTable = "tickets";
const ticketUpdateTable = "ticket_updates";

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

export const getMostUpvoted = async () => {
    try {
        // const upvotesQueryCommand = new QueryCommand({
        //     TableName: ticketsTable,
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
            TableName: ticketsTable,
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
                    TableName: ticketUpdateTable,
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
            //         ticketUpdateTable: {
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
            // batchResponse.Responses?.ticketUpdateTable.forEach(item => {
            //     const ticket_id = item.ticket_id.S;
            //     if (ticket_id) {
            //         commentCounts.set(ticket_id, (commentCounts.get(ticket_id) || 0) + 1);
            //     }
            // });

            // // Attach comment counts to top items
            // topItems.forEach(item => {
            //     item.commentcount = commentCounts.get(item.ticket_id) || 0;
            // });

            await getUserprofile(topItems);
            return topItems;
        } else {
            throw new Error("TicketDontExist: Seems tickets don't exist");
        }
    } catch (error: any) {
        return { Status: "FAILED", Error: error.message };
    }
};


const getUserprofile = async (ticketData: any[]) => {
    try {
        for (let ticket of ticketData) {
            const userResponse: AdminGetUserCommandOutput = await cognitoClient.send(
                new AdminGetUserCommand({
                    UserPoolId: process.env.USER_POOL_ID!,
                    Username: ticket["username"]
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

            const responseMunicipality = await dynamoDBClient.send(
                new GetItemCommand({
                    TableName: "municipalities",
                    Key: {
                        "municipality_id": marshall(ticket.municipality_id)
                    }
                })
            );

            if (responseMunicipality.Item) {
                const municipality = unmarshall(responseMunicipality.Item);
                ticket.municipality_picture = municipality["municipalityLogo"];
                ticket.municipality = municipality["municipality_id"];
            } else {
                ticket.municipality_picture = "";
                ticket.municipality = "";
            }
        }

    } catch (error: any) {
        if (error.name === "UserNotFoundException") {
            console.error(`User ${ticketData[0]?.username} not found.`);
        } else {
            console.error("An error occurred:", error);
        }
    }
};

export const getWatchlist = async (userId: string) => {
    try {
        const collective: any[] = [];

        if (!userId) {
            throw new Error("IncorrectFields: Missing required query: username");
        }

        const scanParams = {
            TableName: "watchlist_table",
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
                    TableName: "tickets_table",
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
                            TableName: ticketUpdateTable,
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

                await getUserprofile(ticketsItems);
                collective.push(...ticketsItems);
            }
            return collective;
        } else {
            throw new Error("NoWatchlist: Doesn't have a watchlist");
        }

    } catch (e: any) {
        return { Status: "FAILED", Error: `${e.message}` };
    }
};

export const getTicketsInMunicipality = async (municipality: string) => {
    try {
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
            TableName: ticketsTable,
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
                    TableName: ticketUpdateTable,
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

            await getUserprofile(items);
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

    } catch (e: any) {
        return { Status: "FAILED", Error: `${e.message}` };
    }
};