import { BatchGetCommand, BatchGetCommandInput, QueryCommand, QueryCommandInput, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { COMPANIES_TABLE, CONTRACT_TABLE, dynamoDBDocumentClient, TENDERS_TABLE, TICKETS_TABLE } from "../config/dynamodb.config";
import { BadRequestError } from "../types/error.types";
import { WebSocket } from "ws";

export const updateTenderTable = async (tender_id: string, update_expression: string, expression_attribute_names: Record<string, string>, expression_attribute_values: Record<string, any>) => {
    try {
        const params: UpdateCommandInput = {
            TableName: TENDERS_TABLE,
            Key: {
                tender_id: tender_id
            },
            UpdateExpression: update_expression,
            ExpressionAttributeNames: expression_attribute_names,
            ExpressionAttributeValues: expression_attribute_values
        };

        const writeCommand = new UpdateCommand(params);
        const response = await dynamoDBDocumentClient.send(writeCommand);
        return response;
    } catch (error: any) {
        throw new BadRequestError(`Failed to update tender: ${error.message}`);
    }
};

export const updateContractTable = async (contract_id: string, update_expression: string, expression_attribute_names: Record<string, string>, expression_attribute_values: Record<string, any>) => {
    try {
        const params: UpdateCommandInput = {
            TableName: CONTRACT_TABLE,
            Key: {
                contract_id: contract_id
            },
            UpdateExpression: update_expression,
            ExpressionAttributeNames: expression_attribute_names,
            ExpressionAttributeValues: expression_attribute_values
        };

        const writeCommand = new UpdateCommand(params);
        const response = await dynamoDBDocumentClient.send(writeCommand);

        return response;
    } catch (error: any) {
        throw new BadRequestError(`Failed to update contract: ${error.message}`);
    }
};

export const assignCompanyName = async (data: any[]) => {
    const params: BatchGetCommandInput = {
        RequestItems: {
            [COMPANIES_TABLE]: {
                Keys: data.map((item) => ({
                    pid: item.company_id
                })),
                ProjectionExpression: "name"
            }
        }
    };

    try {
        const command = new BatchGetCommand(params);
        const results = await dynamoDBDocumentClient.send(command);

        results.Responses?.[COMPANIES_TABLE].forEach((company, index) => {
            data[index].companyname = company ? company.name : "Xero industries";
        });
    }
    catch (error: any) {
        throw new BadRequestError(`Failed to assign company name: ${error.message}`);
    }
};

export const assignLongLat = async (data: any[]) => {
    for (let item of data) {
        if (!item) {
            continue;
        }

        const params: QueryCommandInput = {
            TableName: TICKETS_TABLE,
            KeyConditionExpression: "ticket_id = :ticket_id",
            ExpressionAttributeValues: {
                ":ticket_id": item.ticket_id
            },
            ProjectionExpression: "longitude, latitude, ticketnumber"
        };

        try {
            const command = new QueryCommand(params);
            const response = await dynamoDBDocumentClient.send(command);

            if (!response.Items || response.Items.length <= 0) {
                item.longitude = 26.5623685320641;
                item.latitude = -32.90383;
            } else {
                const ticket = response.Items[0];
                item.longitude = ticket.longitude;
                item.latitude = ticket.latitude;
                item.ticketnumber = ticket.ticketnumber;
            }
        } catch (error: any) {
            throw new BadRequestError(`Failed to assign long and lat: ${error.message}`);
        }
    }
};

export const assignMuni = async (data: any[]) => {
    for(const item of data) {
        if(!item) {
            continue;
        }

        const params: QueryCommandInput = {
            TableName: TICKETS_TABLE,
            KeyConditionExpression: "ticket_id = :ticket_id",
            ExpressionAttributeValues: {
                ":ticket_id": item.ticket_id
            },
               ProjectionExpression: "municipality_id, ticketnumber"
        };

        const command = new QueryCommand(params);
        const response = await dynamoDBDocumentClient.send(command);

        if(!response.Items || response.Items.length <= 0) {
            item.municipality = "Stellenbosch Local";
            item.ticketnumber = "MAA2-4052-8NAS";
        } else {
            item.municipality = response.Items[0].municipality_id;
            item.ticketnumber = response.Items[0].ticketnumber;
        }
    }
};

export const sendWebSocketMessage = (message: string) => {
    return new Promise((resolve, reject) => {
        // Open a secure WebSocket connection
        const WEB_SOCKET_URL = String(process.env.WEB_SOCKET_URL);
        const ws = new WebSocket(WEB_SOCKET_URL);

        // Handle connection opening
        ws.on("open", () => {
            // Send a message through the WebSocket connection
            ws.send(message, (err) => {
                if (err) {
                    console.error('Error sending message:', err);
                    reject(err);
                } else {
                    console.log('Message sent:', message);
                    ws.close();
                }
            });
        });

        // Handle errors
        ws.on("error", (err) => {
            console.error('WebSocket error:', err);
            reject(err);
        });

        // Close the WebSocket connection after sending the message
        ws.on("close", () => {
            console.log('WebSocket connection closed.');
            resolve(true);
        });

    });
}