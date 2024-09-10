import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { cognitoClient, COMPANIES_TABLE, dynamoDBClient, TICKETS_TABLE } from "../config/dynamodb.config";
import { BadRequestError } from "../types/error.types";
import { GetItemCommand, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { AdminGetUserCommand, AdminGetUserCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { v4 as uuidv4 } from 'uuid';


interface Company {
    name: string;
    pid: string;
}

export const getUserProfile = async (ticketData: any[]) => {
    try {
        const USER_POOL_ID = process.env.USER_POOL_ID;
        for (let ticket of ticketData) {
            const userResponse: AdminGetUserCommandOutput = await cognitoClient.send(
                new AdminGetUserCommand({
                    UserPoolId: USER_POOL_ID,
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

export const doesTicketExist = async (ticket_id: string) => {
    try {
        const checking_ticket = await dynamoDBClient.send(
            new QueryCommand({
                TableName: TICKETS_TABLE,
                KeyConditionExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": marshall(ticket_id)
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

export const formatResponse = (statusCode: number, body: any) => {
    return new Response(
        JSON.stringify(body, (key, value) => {
            return typeof value === 'object' && value !== null ? convertDecimalToFloat(value) : value;
        }),
        {
            status: statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
                "Access-Control-Allow-Headers": "Authorization,Content-Type,X-Amz-Date,X-Amz-Security-Token,X-Api-Key",
            },
        }
    );
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
        const response = await dynamoDBClient.send(
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
        const command = new ScanCommand({ TableName: COMPANIES_TABLE });
        const response = await dynamoDBClient.send(command);
        const items = response.Items?.map(item => unmarshall(item)) as Company[] || [];

        const company = items.find(item => item.name.toLowerCase() === companyName.toLowerCase());
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
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month in two digits
    const day = now.getDate().toString().padStart(2, '0'); // Day in two digits

    const year1 = year.charAt(0);
    const restOfTheYear = year.slice(1);

    // Generate the 4 random digits or letters in uppercase
    const randomItem = uuidv4().replace(/-/g, '').slice(0, 4).toUpperCase();

    // Construct the ticket number according to the format mmmY-YMMD-DRRR
    const ticketNumber = `${municipalityCode}${muni}${year1}-${restOfTheYear}${month}${day}-${randomItem}`;

    return ticketNumber;
};


