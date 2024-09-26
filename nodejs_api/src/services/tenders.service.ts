import { PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { COMPANIES_TABLE, CONTRACT_TABLE, dynamoDBDocumentClient, TENDERS_TABLE, TICKETS_TABLE } from "../config/dynamodb.config";
import { ClientError } from "../types/error.types";
import { generateId, getCompanyIDFromName } from "../utils/tickets.utils";
import { assignCompanyName, assignLongLat, assignMuni, updateContractTable, updateTenderTable } from "../utils/tenders.utils";

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
    const responseCheck = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: TENDERS_TABLE,
        IndexName: "company_id-index",
        KeyConditionExpression: "company_id = :company_id",
        FilterExpression: "ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":company_id": companyId,
            ":ticket_id": senderData.ticket_id
        }
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
        tender_id: tenderId,
        company_id: companyId,
        datetimefinalised: "<empty>",
        datetimereviewed: "<empty>",
        datetimesubmitted: submittedTime,
        estimatedTimeHours: estimatedTime.toString(),
        quote: quote.toString(),
        status: "submitted",
        ticket_id: senderData.ticket_id
    };

    await dynamoDBDocumentClient.send(new PutCommand({
        TableName: TENDERS_TABLE,
        Item: tenderItem,
    }));

    return {
        Status: "Success",
        message: "Tender created successfully",
        tender_id: tenderId,
    };
};

export const inReview = async (senderData: InReviewData) => {
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
    const responseTender = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: TENDERS_TABLE,
        IndexName: "company_id-index",
        KeyConditionExpression: "company_id = :company_id",
        FilterExpression: "ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":company_id": companyId,
            ":ticket_id": senderData.ticket_id
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

    const tenderId = tenderItems[0].tender_id;
    const currentTime = new Date();
    const reviewedTime = currentTime.toISOString();
    const updateExp = "set #status = :r, datetimereviewed = :p";
    const expattrName = { "#status": "status" };
    const expattrValue = {
        ":r": "under review",
        ":p": reviewedTime,
    };

    const response = await updateTenderTable(tenderId, updateExp, expattrName, expattrValue);

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
};

export const acceptTender = async (senderData: AcceptOrRejectTenderData) => {
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

    const responseTender = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: TENDERS_TABLE,
        IndexName: "company_id-index",
        KeyConditionExpression: "company_id = :company_id",
        FilterExpression: "ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":company_id": senderData.company_id,
            ":ticket_id": senderData.ticket_id
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

    const tenderId = tenderItems[0].tender_id;
    const ticketId = tenderItems[0].ticket_id;
    const updateExp = "set #status = :r";
    const expattrName = { "#status": "status" };
    const expattrValue = { ":r": "accepted" };

    const response = await updateTenderTable(tenderId, updateExp, expattrName, expattrValue);

    const responseTickets = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: TENDERS_TABLE,
        IndexName: "ticket_id-index",
        KeyConditionExpression: "ticket_id = :ticket_id",
        FilterExpression: "ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":ticket_id": ticketId
        }
    }));

    const responseItems = responseTickets.Items;
    if (responseItems && responseItems.length > 0) {
        for (const data of responseItems) {
            if (data.tender_id !== tenderId) {
                const rejectExpattrValue = { ":r": "rejected" };
                const responseReject = await updateTenderTable(data.tender_id, updateExp, expattrName, rejectExpattrValue);
            }
        }
    }

    // Editing ticket as well to In Progress
    const ticketUpdateExp = "set #state = :r";
    const ticketExpattrName = { "#state": "state" };
    const ticketExpattrValue = { ":r": "In Progress" };
    await dynamoDBDocumentClient.send(new UpdateCommand({
        TableName: TICKETS_TABLE,
        Key: { ticket_id: ticketId },
        UpdateExpression: ticketUpdateExp,
        ExpressionAttributeNames: ticketExpattrName,
        ExpressionAttributeValues: ticketExpattrValue,
    }));

    // Creating contract once tender is accepted
    const currentTime = new Date();
    const submittedTime = currentTime.toISOString();
    const quote = Number(tenderItems[0].quote);
    const contractId = generateId();
    const contractItem = {
        contract_id: contractId,
        completedatetime: "<empty>",
        contractdatetime: submittedTime,
        finalCost: quote.toString(),
        finalDuration: "",
        paymentdatetime: submittedTime,
        startdatetime: submittedTime,
        status: "in progress",
        tender_id: tenderId
    };

    await dynamoDBDocumentClient.send(new PutCommand({
        TableName: CONTRACT_TABLE,
        Item: contractItem,
    }));

    return {
        Status: "Success",
        Tender_id: tenderId,
        Contract_id: contractId,
    };
};

export const rejectTender = async (senderData: AcceptOrRejectTenderData) => {
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

    const responseTender = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: TENDERS_TABLE,
        IndexName: "company_id-index",
        KeyConditionExpression: "company_id = :company_id",
        FilterExpression: "ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":company_id": senderData.company_id,
            ":ticket_id": senderData.ticket_id
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

    const tenderId = tenderItems[0].tender_id;
    const updateExp = "set #status = :r";
    const expattrName = { "#status": "status" };
    const expattrValue = { ":r": "rejected" };

    const response = await updateTenderTable(tenderId, updateExp, expattrName, expattrValue);

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
};

export const completeContract = async (senderData: { contract_id: string }) => {
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

    const responseContract = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: CONTRACT_TABLE,
        KeyConditionExpression: "contract_id = :contract_id",
        ExpressionAttributeValues: {
            ":contract_id": senderData.contract_id
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
    const expattrValue = { ":r": "completed" };

    const response = await updateContractTable(senderData.contract_id, updateExp, expattrName, expattrValue);

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
};

export const getMunicipalityTenders = async (municipality: string) => {
    if (!municipality) {
        const errorResponse = {
            Error: {
                Code: "IncorrectFields",
                Message: "Missing required query: municipality",
            },
        };
        throw new ClientError(errorResponse, "InvalidFields");
    }

    const responseTickets = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: TICKETS_TABLE,
        IndexName: "municipality_id-dateOpened-index",
        KeyConditionExpression: "municipality_id = :municipality_id",
        ExpressionAttributeValues: {
            ":municipality_id": municipality
        },
        ScanIndexForward: false, // sort in descending order (from most recent ticket to oldest)
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
        const responseTender = await dynamoDBDocumentClient.send(new QueryCommand({
            TableName: TENDERS_TABLE,
            IndexName: "ticket_id-index",
            KeyConditionExpression: "ticket_id = :ticket_id",
            ExpressionAttributeValues: {
                ":ticket_id": item.ticket_id || ""
            }
        }));

        if (responseTender.Items && responseTender.Items.length > 0) {
            await assignMuni(responseTender.Items);
            await assignLongLat(responseTender.Items);
            await assignCompanyName(responseTender.Items);
            collective.push(...responseTender.Items);
        }
    }

    return collective;
};

export const getCompanyTenders = async (company_name: string) => {
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

    const responseTenders = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: TENDERS_TABLE,
        IndexName: "company_id-index",
        KeyConditionExpression: "company_id = :company_id",
        ExpressionAttributeValues: {
            ":company_id": companyId
        },
    }));

    const items = responseTenders.Items || [];
    await assignCompanyName(items);
    await assignLongLat(items);
    await assignMuni(items);

    return items;
};

export const getTicketTender = async (ticket_id: string) => {
    if (!ticket_id) {
        const errorResponse = {
            Error: {
                Code: "IncorrectFields",
                Message: "Missing required query: ticket",
            },
        };
        throw new ClientError(errorResponse, "InvalidFields");
    }

    const responseTender = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: TENDERS_TABLE,
        IndexName: "ticket_id-index",
        KeyConditionExpression: "ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":ticket_id": ticket_id
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

    await assignCompanyName(items);
    await assignLongLat(items);
    await assignMuni(items);

    return items;
};

export const getContracts = async (tender_id: string) => {
    if (!tender_id) {
        const errorResponse = {
            Error: {
                Code: "IncorrectFields",
                Message: "Missing required query: tender",
            },
        };
        throw new ClientError(errorResponse, "InvalidFields");
    }

    const responseContracts = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: CONTRACT_TABLE,
        IndexName: "tender_id-index",
        KeyConditionExpression: "tender_id = :tender_id",
        ExpressionAttributeValues: {
            ":tender_id": tender_id
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

    const responseTender = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: TENDERS_TABLE,
        KeyConditionExpression: "tender_id = :tender_id",
        ExpressionAttributeValues: {
            ":tender_id": tender_id
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
    const responseName = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: COMPANIES_TABLE,
        KeyConditionExpression: "pid = :pid",
        ExpressionAttributeValues: {
            ":pid": tenderItem.company_id
        },
    }));

    const companyItems = responseName.Items || [];
    if (companyItems.length === 0) {
        contractItems[0].companyname = "Xero Industries";
    } else {
        const company = companyItems[0];
        contractItems[0].companyname = company.name || "Unknown Company";
    }

    return contractItems[0];
};



export const getCompanyContracts = async (tender_id: string, company_name: string) => {
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

    const responseContracts = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: CONTRACT_TABLE,
        IndexName: "tender_id-index",
        KeyConditionExpression: "tender_id = :tender_id",
        ExpressionAttributeValues: {
            ":tender_id": tender_id
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

    const responseTender = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: TENDERS_TABLE,
        KeyConditionExpression: "tender_id = :tender_id",
        FilterExpression: "company_id = :company_id",
        ExpressionAttributeValues: {
            ":tender_id": tender_id,
            ":company_id": companyId
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
    const responseName = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: COMPANIES_TABLE,
        KeyConditionExpression: "pid = :pid",
        ExpressionAttributeValues: {
            ":pid": tenderItem.company_id
        },
    }));

    const companyItems = responseName.Items || [];
    if (companyItems.length === 0) {
        contractItems[0].companyname = "Xero Industries";
    } else {
        const company = companyItems[0];
        contractItems[0].companyname = company.name || "Unknown Company";
    }

    return contractItems[0];
};

