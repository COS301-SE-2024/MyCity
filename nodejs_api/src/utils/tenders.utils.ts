import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { COMPANIES_TABLE, CONTRACT_TABLE, dynamoDBClient, TENDERS_TABLE, TICKETS_TABLE } from "../config/dynamodb.config";
import { BadRequestError } from "../types/error.types";
import { QueryCommand } from "@aws-sdk/client-dynamodb";

export const updateTenderTable = async (tender_id: string, update_expression: string, expression_attribute_names: Record<string, string>, expression_attribute_values: Record<string, any>) => {
    try {
        const response = await dynamoDBClient.send(
            new UpdateCommand({
                TableName: TENDERS_TABLE,
                Key: {
                    tender_id: tender_id
                },
                UpdateExpression: update_expression,
                ExpressionAttributeNames: expression_attribute_names,
                ExpressionAttributeValues: expression_attribute_values
            })
        );

        return response;
    } catch (error: any) {
        throw new BadRequestError(`Failed to update tender: ${error.message}`);
    }
};


export const updateContractTable = async (contract_id: string, update_expression: string, expression_attribute_names: Record<string, string>, expression_attribute_values: Record<string, any>) => {
    try {
        const response = await dynamoDBClient.send(
            new UpdateCommand({
                TableName: CONTRACT_TABLE,
                Key: {
                    contract_id: contract_id
                },
                UpdateExpression: update_expression,
                ExpressionAttributeNames: expression_attribute_names,
                ExpressionAttributeValues: expression_attribute_values
            })
        );

        return response;
    } catch (error: any) {
        throw new BadRequestError(`Failed to update contract: ${error.message}`);
    }
};


export const assignCompanyName = async (data: any[]) => {
    for (const item of data) {
        const responseName = await dynamoDBClient.send(new QueryCommand({
            TableName: COMPANIES_TABLE,
            KeyConditionExpression: "pid = :pid",
            ExpressionAttributeValues: {
                ":pid": { S: item.company_id.S }
            }
        }));

        if (!responseName.Items || responseName.Items.length <= 0) {
            item.companyname = "Xero industries";
        } else {
            const items = responseName.Items[0];
            item.companyname = items.name.S;
        }
    }
};

export const assignLongLat = async (data: any[]) => {
    for (const item of data) {
        const response = await dynamoDBClient.send(new QueryCommand({
            TableName: TICKETS_TABLE,
            KeyConditionExpression: "ticket_id = :ticket_id",
            ExpressionAttributeValues: {
                ":ticket_id": { S: item.ticket_id.S }
            }
        }));

        if (!response.Items || response.Items.length <= 0) {
            item.longitude = "26.5623685320641";
            item.latitude = "-32.90383";
        } else {
            const tickets = response.Items[0];
            item.longitude = tickets.longitude.S;
            item.latitude = tickets.latitude.S;
            item.ticketnumber = tickets.ticketnumber.S;
        }
    }
};

export const assignMuni = async (data: any[]) => {
    for (const item of data) {
        const responseTender = await dynamoDBClient.send(new QueryCommand({
            TableName: TENDERS_TABLE,
            KeyConditionExpression: "tender_id = :tender_id",
            ExpressionAttributeValues: {
                ":tender_id": { S: item.tender_id.S }
            }
        }));

        if (!responseTender.Items || responseTender.Items.length <= 0) {
            item.municipality = "Stellenbosch Local";
            item.ticketnumber = "MAA2-4052-8NAS";
        } else {
            const tenders = responseTender.Items[0];
            const responseTickets = await dynamoDBClient.send(new QueryCommand({
                TableName: TICKETS_TABLE,
                KeyConditionExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": { S: tenders.ticket_id.S || "" }
                }
            }));

            if (!responseTickets.Items || responseTickets.Items.length <= 0) {
                item.municipality = "Stellenbosch Local";
                item.ticketnumber = "MAA2-4052-8NAS";
            } else {
                const ticketDetails = responseTickets.Items[0];
                item.municipality = ticketDetails.municipality_id.S;
                item.ticketnumber = ticketDetails.ticketnumber.S;
            }
        }
    }
};
