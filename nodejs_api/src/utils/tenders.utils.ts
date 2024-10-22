import { QueryCommand, QueryCommandInput, QueryCommandOutput, UpdateCommand, UpdateCommandInput, UpdateCommandOutput } from "@aws-sdk/lib-dynamodb";
import { COMPANIES_TABLE, CONTRACT_TABLE, dynamoDBDocumentClient, TENDERS_TABLE, TICKETS_TABLE } from "../config/dynamodb.config";
import { BadRequestError } from "../types/error.types";
import { JobData } from "../types/job.types";
import { DB_QUERY, DB_UPDATE } from "../config/redis.config";
import { addJobToWriteQueue, addMultipleJobsToReadQueue } from "../services/jobs.service";
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

        const jobData: JobData = {
            type: DB_UPDATE,
            params: params
        };

        const writeJob = await addJobToWriteQueue(jobData);
        const response = await writeJob.finished() as UpdateCommandOutput;
        return response;
    } catch (error: any) {
        throw new BadRequestError(`Failed to update tender: ${error.message}`);
    }
};

export const updateContractTable = async (contract_id: string, update_expression: string, expression_attribute_names: Record<string, string>, expression_attribute_values: Record<string, any>) => {
    try {
        const response = await dynamoDBDocumentClient.send(
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
    const queryJobs: JobData[] = [];

    for (const item of data) {
        if (!item) {
            continue;
        }

        const params: QueryCommandInput = {
            TableName: COMPANIES_TABLE,
            KeyConditionExpression: "pid = :pid",
            ExpressionAttributeValues: {
                ":pid": item.company_id
            }
        };

        const jobData: JobData = {
            type: DB_QUERY,
            params: params
        };

        queryJobs.push(jobData);
    }

    const jobResults = await addMultipleJobsToReadQueue(queryJobs);

    jobResults.forEach(async (job, index) => {
        const response = await job.finished() as QueryCommandOutput;
        const company = response.Items ? response.Items[0] : null;
        data[index].companyname = company ? company.name : "Xero industries";
    });
};

export const assignLongLat = async (data: any[]) => {
    const queryJobs: JobData[] = [];

    for (const item of data) {
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

        const jobData: JobData = {
            type: DB_QUERY,
            params: params
        };

        queryJobs.push(jobData);
    }

    const jobResults = await addMultipleJobsToReadQueue(queryJobs);

    jobResults.forEach(async (job, index) => {
        const response = await job.finished() as QueryCommandOutput;
        const ticket = response.Items ? response.Items[0] : null;

        data[index].longitude = ticket ? ticket.longitude : 26.5623685320641;
        data[index].latitude = ticket ? ticket.latitude : -32.90383;
        data[index].ticketnumber = ticket ? ticket.ticketnumber : undefined;
    });
};

export const assignMuni = async (data: any[]) => {
    const queryJobs: JobData[] = [];

    for (const item of data) {
        if (!item) {
            continue;
        }

        const params: QueryCommandInput = {
            TableName: TENDERS_TABLE,
            KeyConditionExpression: "tender_id = :tender_id",
            ExpressionAttributeValues: {
                ":tender_id": item.tender_id
            }
        };

        const jobData: JobData = {
            type: DB_QUERY,
            params: params
        };

        queryJobs.push(jobData);

        if (!responseTender.Items || responseTender.Items.length <= 0) {
            item.municipality = "Stellenbosch Local";
            item.ticketnumber = "MAA2-4052-8NAS";
        } else {
            const tenders = responseTender.Items[0];
            const responseTickets = await dynamoDBDocumentClient.send(new QueryCommand({
                TableName: TICKETS_TABLE,
                KeyConditionExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": tenders.ticket_id
                }
            }));

            if (!responseTickets.Items || responseTickets.Items.length <= 0) {
                item.municipality = "Stellenbosch Local";
                item.ticketnumber = "MAA2-4052-8NAS";
            } else {
                const ticketDetails = responseTickets.Items[0];
                item.municipality = ticketDetails.municipality_id;
                item.ticketnumber = ticketDetails.ticketnumber;
            }
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