import { PutItemCommand, QueryCommand, ScanCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { COMPANIES_TABLE, CONTRACT_TABLE, dynamoDBClient, TENDERS_TABLE, TICKETS_TABLE } from '../config/dynamodb.config';
import { ClientError } from '../types/error.types';
import { generateId, getCompanyIDFromName } from '../utils/tickets.utils';
import { assignCompanyName, assignLongLat, assignMuni } from '../utils/tenders.utils';

interface TenderData {
    company_name: string;
    quote: string;
    ticket_id: string;
    duration: string;
}

interface InReviewData {
    company_name: string;
    ticket_id: string;
}

interface AcceptOrRejectTenderData {
    company_id: string;
    ticket_id: string;
}

export const createTender = async (senderData: TenderData) => {
    try {
        const requiredFields = ["company_name", "quote", "ticket_id", "duration"];

        for (const field of requiredFields) {
            if (!(field in senderData)) {
                const errorResponse = {
                    Error: {
                        Code: "IncorrectFields",
                        Message: `Missing required field: ${field}`,
                    },
                };
                throw new ClientError(errorResponse, "InvalidFields");
            }
        }

        const companyPid = await getCompanyIDFromName(senderData.company_name);
        if (!companyPid) {
            const errorResponse = {
                Error: {
                    Code: "CompanyDoesntExist",
                    Message: "Company Does not Exist",
                },
            };
            throw new ClientError(errorResponse, "CompanyDoesntExist");
        }

        const companyId = companyPid;
        const responseCheck = await dynamoDBClient.send(new ScanCommand({
            TableName: COMPANIES_TABLE,
            FilterExpression: "company_id = :company_id AND ticket_id = :ticket_id",
            ExpressionAttributeValues: {
                ":company_id": { S: companyId },
                ":ticket_id": { S: senderData.ticket_id },
            },
        }));

        if (responseCheck.Items && responseCheck.Items.length > 0) {
            const errorResponse = {
                Error: {
                    Code: "TenderExist",
                    Message: "Company already has a tender on this Ticket",
                },
            };
            throw new ClientError(errorResponse, "TenderExist");
        }

        const currentTime = new Date();
        const estimatedTime = Number(senderData.duration) * 24;
        const submittedTime = currentTime.toISOString();
        const quote = Number(senderData.quote);
        const tenderId = generateId();

        const tenderItem = {
            tender_id: { S: tenderId },
            company_id: { S: companyId },
            datetimefinalised: { S: "<empty>" },
            datetimereviewed: { S: "<empty>" },
            datetimesubmitted: { S: submittedTime },
            estimatedTimeHours: { N: estimatedTime.toString() },
            quote: { N: quote.toString() },
            status: { S: "submitted" },
            ticket_id: { S: senderData.ticket_id },
        };

        await dynamoDBClient.send(new PutItemCommand({
            TableName: COMPANIES_TABLE,
            Item: tenderItem,
        }));

        return {
            Status: "Success",
            message: "Tender created successfully",
            tender_id: tenderId,
        };

    } catch (e) {
        if (e instanceof ClientError) {
            const errorMessage = e.response.Error.Message;
            return { Status: "FAILED", Error: errorMessage };
        }
        throw e;
    }
};


export const inreview = async (senderData: InReviewData) => {
    try {
        const requiredFields = ["company_name", "ticket_id"];

        for (const field of requiredFields) {
            if (!(field in senderData)) {
                const errorResponse = {
                    Error: {
                        Code: "IncorrectFields",
                        Message: `Missing required field: ${field}`,
                    },
                };
                throw new ClientError(errorResponse, "InvalidFields");
            }
        }

        const companyPid = await getCompanyIDFromName(senderData.company_name);
        if (!companyPid) {
            const errorResponse = {
                Error: {
                    Code: "CompanyDoesntExist",
                    Message: "Company Does not Exist",
                },
            };
            throw new ClientError(errorResponse, "CompanyDoesntExist");
        }

        const companyId = companyPid;
        const responseTender = await dynamoDBClient.send(new ScanCommand({
            TableName: COMPANIES_TABLE,
            FilterExpression: "company_id = :company_id AND ticket_id = :ticket_id",
            ExpressionAttributeValues: {
                ":company_id": { S: companyId },
                ":ticket_id": { S: senderData.ticket_id },
            },
        }));

        const tenderItems = responseTender.Items;
        if (!tenderItems || tenderItems.length === 0) {
            const errorResponse = {
                Error: {
                    Code: "TenderDoesntExist",
                    Message: "Tender Does not Exist",
                },
            };
            throw new ClientError(errorResponse, "TenderDoesntExist");
        }

        const tenderId = tenderItems[0].tender_id.S;
        const currentTime = new Date();
        const reviewedTime = currentTime.toISOString();
        const updateExp = "set #status = :r, datetimereviewed = :p";
        const expattrName = { "#status": "status" };
        const expattrValue = {
            ":r": { S: "under review" },
            ":p": { S: reviewedTime },
        };

        const response = await dynamoDBClient.send(new UpdateItemCommand({
            TableName: COMPANIES_TABLE,
            Key: { tender_id: { S: tenderId! } },
            UpdateExpression: updateExp,
            ExpressionAttributeNames: expattrName,
            ExpressionAttributeValues: expattrValue,
        }));

        if (response.$metadata.httpStatusCode === 200) {
            return { Status: "Success", Message: "Tender updated successfully" };
        } else {
            const errorResponse = {
                Error: {
                    Code: "UpdateError",
                    Message: "Error occurred trying to update",
                },
            };
            throw new ClientError(errorResponse, "UpdateError");
        }
    } catch (e) {
        if (e instanceof ClientError) {
            const errorMessage = e.response.Error.Message;
            return { Status: "FAILED", Error: errorMessage };
        }
        throw e;
    }
};


export const acceptTender = async (senderData: AcceptOrRejectTenderData) => {
    try {
        const requiredFields = ["company_id", "ticket_id"];

        for (const field of requiredFields) {
            if (!(field in senderData)) {
                const errorResponse = {
                    Error: {
                        Code: "IncorrectFields",
                        Message: `Missing required field: ${field}`,
                    },
                };
                throw new ClientError(errorResponse, "InvalidFields");
            }
        }

        const responseTender = await dynamoDBClient.send(new ScanCommand({
            TableName: COMPANIES_TABLE,
            FilterExpression: "company_id = :company_id AND ticket_id = :ticket_id",
            ExpressionAttributeValues: {
                ":company_id": { S: senderData.company_id },
                ":ticket_id": { S: senderData.ticket_id },
            },
        }));

        const tenderItems = responseTender.Items;
        if (!tenderItems || tenderItems.length === 0) {
            const errorResponse = {
                Error: {
                    Code: "TenderDoesntExist",
                    Message: "Tender Does not Exist",
                },
            };
            throw new ClientError(errorResponse, "TenderDoesntExist");
        }

        const tenderId = tenderItems[0].tender_id.S!;
        const ticketId = tenderItems[0].ticket_id.S!;
        const updateExp = "set #status = :r";
        const expattrName = { "#status": "status" };
        const expattrValue = { ":r": { S: "accepted" } };

        await dynamoDBClient.send(new UpdateItemCommand({
            TableName: COMPANIES_TABLE,
            Key: { tender_id: { S: tenderId } },
            UpdateExpression: updateExp,
            ExpressionAttributeNames: expattrName,
            ExpressionAttributeValues: expattrValue,
        }));

        const responseTickets = await dynamoDBClient.send(new ScanCommand({
            TableName: COMPANIES_TABLE,
            FilterExpression: "ticket_id = :ticket_id",
            ExpressionAttributeValues: {
                ":ticket_id": { S: ticketId },
            },
        }));

        const responseItems = responseTickets.Items;
        if (responseItems && responseItems.length > 0) {
            for (const data of responseItems) {
                if (data.tender_id.S !== tenderId) {
                    const rejectExpattrValue = { ":r": { S: "rejected" } };
                    await dynamoDBClient.send(new UpdateItemCommand({
                        TableName: COMPANIES_TABLE,
                        Key: { tender_id: { S: data.tender_id.S! } },
                        UpdateExpression: updateExp,
                        ExpressionAttributeNames: expattrName,
                        ExpressionAttributeValues: rejectExpattrValue,
                    }));
                }
            }
        }

        // Editing ticket as well to In Progress
        const ticketUpdateExp = "set #state = :r";
        const ticketExpattrName = { "#state": "state" };
        const ticketExpattrValue = { ":r": { S: "In Progress" } };
        await dynamoDBClient.send(new UpdateItemCommand({
            TableName: TICKETS_TABLE,
            Key: { ticket_id: { S: ticketId } },
            UpdateExpression: ticketUpdateExp,
            ExpressionAttributeNames: ticketExpattrName,
            ExpressionAttributeValues: ticketExpattrValue,
        }));

        // Creating contract once tender is accepted
        const currentTime = new Date();
        const submittedTime = currentTime.toISOString();
        const quote = Number(tenderItems[0].quote.N);
        const contractId = generateId();
        const contractItem = {
            contract_id: { S: contractId },
            completedatetime: { S: "<empty>" },
            contractdatetime: { S: submittedTime },
            finalCost: { N: quote.toString() },
            finalDuration: { S: "" },
            paymentdatetime: { S: submittedTime },
            startdatetime: { S: submittedTime },
            status: { S: "in progress" },
            tender_id: { S: tenderId },
        };

        await dynamoDBClient.send(new PutItemCommand({
            TableName: CONTRACT_TABLE,
            Item: contractItem,
        }));

        return {
            Status: "Success",
            Tender_id: tenderId,
            Contract_id: contractId,
        };

    } catch (e) {
        if (e instanceof ClientError) {
            const errorMessage = e.response.Error.Message;
            return { Status: "FAILED", Error: errorMessage };
        }
        throw e;
    }
};




export const rejectTender = async (senderData: AcceptOrRejectTenderData) => {
    try {
        const requiredFields = ["company_id", "ticket_id"];

        for (const field of requiredFields) {
            if (!(field in senderData)) {
                const errorResponse = {
                    Error: {
                        Code: "IncorrectFields",
                        Message: `Missing required field: ${field}`,
                    },
                };
                throw new ClientError(errorResponse, "InvalidFields");
            }
        }

        const responseTender = await dynamoDBClient.send(new ScanCommand({
            TableName: COMPANIES_TABLE,
            FilterExpression: "company_id = :company_id AND ticket_id = :ticket_id",
            ExpressionAttributeValues: {
                ":company_id": { S: senderData.company_id },
                ":ticket_id": { S: senderData.ticket_id },
            },
        }));

        const tenderItems = responseTender.Items;
        if (!tenderItems || tenderItems.length === 0) {
            const errorResponse = {
                Error: {
                    Code: "TenderDoesntExist",
                    Message: "Tender Does not Exist",
                },
            };
            throw new ClientError(errorResponse, "TenderDoesntExist");
        }

        const tenderId = tenderItems[0].tender_id.S!;
        const updateExp = "set #status = :r";
        const expattrName = { "#status": "status" };
        const expattrValue = { ":r": { S: "rejected" } };

        const response = await dynamoDBClient.send(new UpdateItemCommand({
            TableName: COMPANIES_TABLE,
            Key: { tender_id: { S: tenderId } },
            UpdateExpression: updateExp,
            ExpressionAttributeNames: expattrName,
            ExpressionAttributeValues: expattrValue,
        }));

        if (response.$metadata.httpStatusCode === 200) {
            return {
                Status: "Success",
                Tender_id: tenderId,
            };
        } else {
            const errorResponse = {
                Error: {
                    Code: "UpdateError",
                    Message: "Error occurred trying to update",
                },
            };
            throw new ClientError(errorResponse, "UpdateError");
        }
    } catch (e) {
        if (e instanceof ClientError) {
            const errorMessage = e.response.Error.Message;
            return { Status: "FAILED", Error: errorMessage };
        }
        throw e;
    }
};



export const completeContract = async (senderData: { contract_id: string }) => {
    try {
        const requiredFields = ["contract_id"];

        for (const field of requiredFields) {
            if (!(field in senderData)) {
                const errorResponse = {
                    Error: {
                        Code: "IncorrectFields",
                        Message: `Missing required field: ${field}`,
                    },
                };
                throw new ClientError(errorResponse, "InvalidFields");
            }
        }

        const responseContract = await dynamoDBClient.send(new ScanCommand({
            TableName: CONTRACT_TABLE,
            FilterExpression: "contract_id = :contract_id",
            ExpressionAttributeValues: {
                ":contract_id": { S: senderData.contract_id },
            },
        }));

        const contractItems = responseContract.Items;
        if (!contractItems || contractItems.length === 0) {
            const errorResponse = {
                Error: {
                    Code: "ContractDoesntExist",
                    Message: "Contract Does not Exist",
                },
            };
            throw new ClientError(errorResponse, "ContractDoesntExist");
        }

        const updateExp = "set #status = :r";
        const expattrName = { "#status": "status" };
        const expattrValue = { ":r": { S: "completed" } };

        const response = await dynamoDBClient.send(new UpdateItemCommand({
            TableName: CONTRACT_TABLE,
            Key: { contract_id: { S: senderData.contract_id } },
            UpdateExpression: updateExp,
            ExpressionAttributeNames: expattrName,
            ExpressionAttributeValues: expattrValue,
        }));

        if (response.$metadata.httpStatusCode === 200) {
            return {
                Status: "Success",
                Contract_id: senderData.contract_id,
            };
        } else {
            const errorResponse = {
                Error: {
                    Code: "UpdateError",
                    Message: "Error occurred trying to update",
                },
            };
            throw new ClientError(errorResponse, "UpdateError");
        }
    } catch (e) {
        if (e instanceof ClientError) {
            const errorMessage = e.response.Error.Message;
            return { Status: "FAILED", Error: errorMessage };
        }
        throw e;
    }
};



export const getMunicipalityTenders = async (municipality: string) => {
    try {
        if (!municipality) {
            const errorResponse = {
                Error: {
                    Code: "IncorrectFields",
                    Message: "Missing required query: municipality",
                },
            };
            throw new ClientError(errorResponse, "InvalidFields");
        }

        const responseTickets = await dynamoDBClient.send(new QueryCommand({
            TableName: TICKETS_TABLE,
            IndexName: "municipality_id-index",
            KeyConditionExpression: "municipality_id = :municipality_id",
            ExpressionAttributeValues: {
                ":municipality_id": { S: municipality },
            },
        }));

        if (!responseTickets.Items || responseTickets.Items.length === 0) {
            const errorResponse = {
                Error: {
                    Code: "TicketsDontExist",
                    Message: "There are no tickets in this municipality",
                },
            };
            throw new ClientError(errorResponse, "TicketsDontExist");
        }

        const collective: any[] = [];
        const tickets = responseTickets.Items;

        for (const item of tickets) {
            const responseTender = await dynamoDBClient.send(new ScanCommand({
                TableName: TENDERS_TABLE,
                FilterExpression: "ticket_id = :ticket_id",
                ExpressionAttributeValues: {
                    ":ticket_id": { S: item.ticket_id.S || "" },
                },
            }));

            if (responseTender.Items && responseTender.Items.length > 0) {
                assignMuni(responseTender.Items);
                assignLongLat(responseTender.Items);
                assignCompanyName(responseTender.Items);
                collective.push(...responseTender.Items);
            }
        }

        return collective;

    } catch (e) {
        if (e instanceof ClientError) {
            const errorMessage = e.response.Error.Message;
            return { Status: "FAILED", Error: errorMessage };
        }
        throw e;
    }
};

export const getCompanyTenders = async (company_name: string) => {
    try {
        if (!company_name) {
            const errorResponse = {
                Error: {
                    Code: "IncorrectFields",
                    Message: "Missing required query: name",
                },
            };
            throw new ClientError(errorResponse, "InvalidFields");
        }

        const companyId = await getCompanyIDFromName(company_name);
        if (!companyId) {
            const errorResponse = {
                Error: {
                    Code: "CompanyDoesntExist",
                    Message: "Company doesn't exist",
                },
            };
            throw new ClientError(errorResponse, "CompanyDoesntExist");
        }

        const responseTenders = await dynamoDBClient.send(new ScanCommand({
            TableName: TENDERS_TABLE,
            FilterExpression: "company_id = :company_id",
            ExpressionAttributeValues: {
                ":company_id": { S: companyId },
            },
        }));

        const items = responseTenders.Items || [];
        assignCompanyName(items);
        assignLongLat(items);
        assignMuni(items);

        return items;
    } catch (e) {
        if (e instanceof ClientError) {
            const errorMessage = e.response.Error.Message;
            return { Status: "FAILED", Error: errorMessage };
        }
        throw e;
    }
};

export const getTicketTender = async (ticket_id: string) => {
    try {
        if (!ticket_id) {
            const errorResponse = {
                Error: {
                    Code: "IncorrectFields",
                    Message: "Missing required query: ticket",
                },
            };
            throw new ClientError(errorResponse, "InvalidFields");
        }

        const responseTender = await dynamoDBClient.send(new ScanCommand({
            TableName: TENDERS_TABLE,
            FilterExpression: "ticket_id = :ticket_id",
            ExpressionAttributeValues: {
                ":ticket_id": { S: ticket_id },
            },
        }));

        const items = responseTender.Items || [];
        if (items.length === 0) {
            const errorResponse = {
                Error: {
                    Code: "TenderDoesntExist",
                    Message: "Tender does not exist",
                },
            };
            throw new ClientError(errorResponse, "TenderDoesntExist");
        }

        assignCompanyName(items);
        assignLongLat(items);
        assignMuni(items);

        return items;
    } catch (e) {
        if (e instanceof ClientError) {
            const errorMessage = e.response.Error.Message;
            return { Status: "FAILED", Error: errorMessage };
        }
        throw e;
    }
};

export const getContracts = async (tender_id: string) => {
    try {
        if (!tender_id) {
            const errorResponse = {
                Error: {
                    Code: "IncorrectFields",
                    Message: "Missing required query: tender",
                },
            };
            throw new ClientError(errorResponse, "InvalidFields");
        }

        const responseContracts = await dynamoDBClient.send(new ScanCommand({
            TableName: CONTRACT_TABLE,
            FilterExpression: "tender_id = :tender_id",
            ExpressionAttributeValues: {
                ":tender_id": { S: tender_id },
            },
        }));

        const contractItems = responseContracts.Items || [];
        if (contractItems.length === 0) {
            const errorResponse = {
                Error: {
                    Code: "ContractDoesntExist",
                    Message: "Contract does not exist",
                },
            };
            throw new ClientError(errorResponse, "ContractDoesntExist");
        }

        const responseTender = await dynamoDBClient.send(new QueryCommand({
            TableName: TENDERS_TABLE,
            KeyConditionExpression: "tender_id = :tender_id",
            ExpressionAttributeValues: {
                ":tender_id": { S: tender_id },
            },
        }));

        const tenderItems = responseTender.Items || [];
        if (tenderItems.length === 0) {
            const errorResponse = {
                Error: {
                    Code: "TenderDoesntExist",
                    Message: "Tender does not exist",
                },
            };
            throw new ClientError(errorResponse, "TenderDoesntExist");
        }

        const tenderItem = tenderItems[0];
        const responseName = await dynamoDBClient.send(new QueryCommand({
            TableName: COMPANIES_TABLE,
            KeyConditionExpression: "pid = :pid",
            ExpressionAttributeValues: {
                ":pid": { S: tenderItem.company_id.S! },
            },
        }));

        const companyItems = responseName.Items || [];
        if (companyItems.length === 0) {
            contractItems[0].companyname = { S: "Xero Industries" };
        } else {
            const company = companyItems[0];
            contractItems[0].companyname = { S: company.name.S || "Unknown Company" };
        }

        return contractItems[0];
    } catch (e) {
        if (e instanceof ClientError) {
            const errorMessage = e.response.Error.Message;
            return { Status: "FAILED", Error: errorMessage };
        }
        throw e;
    }
};



export const getCompanyContracts = async (tender_id: string, company_name: string) => {
    try {
        if (!tender_id || !company_name) {
            const errorResponse = {
                Error: {
                    Code: "IncorrectFields",
                    Message: "Missing required query: tender or company_name",
                },
            };
            throw new ClientError(errorResponse, "InvalidFields");
        }

        const companyId = await getCompanyIDFromName(company_name);
        if (!companyId) {
            const errorResponse = {
                Error: {
                    Code: "CompanyDoesntExist",
                    Message: "Company doesn't exist",
                },
            };
            throw new ClientError(errorResponse, "CompanyDoesntExist");
        }

        const responseContracts = await dynamoDBClient.send(new ScanCommand({
            TableName: CONTRACT_TABLE,
            FilterExpression: "tender_id = :tender_id",
            ExpressionAttributeValues: {
                ":tender_id": { S: tender_id },
            },
        }));

        const contractItems = responseContracts.Items || [];
        if (contractItems.length === 0) {
            const errorResponse = {
                Error: {
                    Code: "ContractDoesntExist",
                    Message: "Contract does not exist",
                },
            };
            throw new ClientError(errorResponse, "ContractDoesntExist");
        }

        const responseTender = await dynamoDBClient.send(new QueryCommand({
            TableName: TENDERS_TABLE,
            KeyConditionExpression: "tender_id = :tender_id",
            FilterExpression: "company_id = :company_id",
            ExpressionAttributeValues: {
                ":tender_id": { S: tender_id },
                ":company_id": { S: companyId },
            },
        }));

        const tenderItems = responseTender.Items || [];
        if (tenderItems.length === 0) {
            const errorResponse = {
                Error: {
                    Code: "CompanyDidntBid",
                    Message: "Company never bid on tender",
                },
            };
            throw new ClientError(errorResponse, "CompanyDidntBid");
        }

        const tenderItem = tenderItems[0];
        const responseName = await dynamoDBClient.send(new QueryCommand({
            TableName: COMPANIES_TABLE,
            KeyConditionExpression: "pid = :pid",
            ExpressionAttributeValues: {
                ":pid": { S: tenderItem.company_id.S! },
            },
        }));

        const companyItems = responseName.Items || [];
        if (companyItems.length === 0) {
            contractItems[0].companyname = { S: "Xero Industries" };
        } else {
            const company = companyItems[0];
            contractItems[0].companyname = { S: company.name.S || "Unknown Company" };
        }

        return contractItems[0];
    } catch (e) {
        if (e instanceof ClientError) {
            const errorMessage = e.response.Error.Message;
            return { Status: "FAILED", Error: errorMessage };
        }
        throw e;
    }
};

