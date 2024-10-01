import { GetCommand, GetCommandInput, GetCommandOutput, PutCommand, PutCommandInput, QueryCommand, QueryCommandInput, QueryCommandOutput, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { COMPANIES_TABLE, CONTRACT_TABLE, dynamoDBDocumentClient, TENDERS_TABLE, TICKETS_TABLE } from "../config/dynamodb.config";
import { BadRequestError, NotFoundError } from "../types/error.types";
import { generateId, getCompanyIDFromName, getTicketDateOpened, updateTicketTable } from "../utils/tickets.utils";
import { assignCompanyName, assignLongLat, assignMuni, updateContractTable, updateTenderTable } from "../utils/tenders.utils";
import WebSocket from "ws";
import { clearRedisCache, DB_GET, DB_PUT, DB_QUERY, DB_UPDATE } from "../config/redis.config";
import { addJobToReadQueue, addJobToWriteQueue } from "./jobs.service";
import { JobData } from "../types/job.types";

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
    await clearRedisCache();
    const companyPid = await getCompanyIDFromName(senderData.company_name);
    if (!companyPid) {
        throw new BadRequestError("Company Does not Exist");
    }

    const companyId = companyPid;
    const params: QueryCommandInput = {
        TableName: TENDERS_TABLE,
        IndexName: "company_id-index",
        KeyConditionExpression: "company_id = :company_id",
        FilterExpression: "ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":company_id": companyId,
            ":ticket_id": senderData.ticket_id
        }
    };

    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    }

    const readJob = await addJobToReadQueue(jobData, { priority: 1 });
    const responseCheck = await readJob.finished() as QueryCommandOutput;

    if (responseCheck.Items && responseCheck.Items.length > 0) {
        throw new BadRequestError("Company already has a tender on this Ticket");
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

    const putParams: PutCommandInput = {
        TableName: TENDERS_TABLE,
        Item: tenderItem
    };

    const putJobData: JobData = {
        type: DB_PUT,
        params: putParams
    }

    const writeJob = await addJobToWriteQueue(putJobData);
    await writeJob.finished();

    console.log("Just before websocket")

    const WEB_SOCKET_URL = String(process.env.WEB_SOCKET_URL);
    const ws = new WebSocket(WEB_SOCKET_URL);
    console.log("WebSocket URL:", WEB_SOCKET_URL);
    ws.on("open", () => {
        console.log("Connection opened")
        const message = JSON.stringify({ action: "refreshcompany" });
        console.log(message)
        ws.send(message);
        ws.close();
    });

    ws.on("error", (err) => {
        console.error("WebSocket error:", err);
        ws.close();  // Ensure the connection is closed on error as well
    });


    return {
        Status: "Success",
        message: "Tender created successfully",
        tender_id: tenderId,
    };
};

export const inReview = async (senderData: InReviewData) => {
    const companyPid = await getCompanyIDFromName(senderData.company_name);
    if (!companyPid) {
        throw new BadRequestError("Company Does not Exist");
    }

    const companyId = companyPid;
    const params: QueryCommandInput = {
        TableName: TENDERS_TABLE,
        IndexName: "company_id-index",
        KeyConditionExpression: "company_id = :company_id",
        FilterExpression: "ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":company_id": companyId,
            ":ticket_id": senderData.ticket_id
        },
    };

    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    }

    const readJob = await addJobToReadQueue(jobData);
    const responseTender = await readJob.finished() as QueryCommandOutput;

    const tenderItems = responseTender.Items;
    if (!tenderItems || tenderItems.length === 0) {
        throw new NotFoundError("Tender Does not Exist");
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

    try {
        const response = await updateTenderTable(tenderId, updateExp, expattrName, expattrValue);
        return { Status: "Success", Message: "Tender updated successfully" };
    }
    catch (error: any) {
        throw new Error("Error occurred trying to update");
    }
};

export const acceptTender = async (senderData: AcceptOrRejectTenderData) => {
    await clearRedisCache();

    const params: QueryCommandInput = {
        TableName: TENDERS_TABLE,
        IndexName: "company_id-index",
        KeyConditionExpression: "company_id = :company_id",
        FilterExpression: "ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":company_id": senderData.company_id,
            ":ticket_id": senderData.ticket_id
        },
    };

    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    }

    const readJob = await addJobToReadQueue(jobData, { priority: 1 });
    const responseTender = await readJob.finished() as QueryCommandOutput;

    const tenderItems = responseTender.Items;
    if (!tenderItems || tenderItems.length === 0) {
        throw new BadRequestError("Tender Does not Exist");
    }

    const tenderId = tenderItems[0].tender_id;
    const ticketId = tenderItems[0].ticket_id;
    const updateExp = "set #status = :r";
    const expattrName = { "#status": "status" };
    const expattrValue = { ":r": "accepted" };

    const response = await updateTenderTable(tenderId, updateExp, expattrName, expattrValue);

    const ticketDateOpened = await getTicketDateOpened(ticketId);

    // Editing ticket as well to In Progress
    const currentTimeTick = new Date().toISOString();
    const ticketUpdateExp = "set #state = :r, #updatedAt = :u";
    const ticketExpattrName = { "#state": "state", "#updatedAt": "updatedAt" };
    const ticketExpattrValue = { ":r": "In Progress", ":u": currentTimeTick };

    const updateParams: UpdateCommandInput = {
        TableName: TICKETS_TABLE,
        Key: {
            ticket_id: ticketId,
            dateOpened: ticketDateOpened
        },
        UpdateExpression: ticketUpdateExp,
        ExpressionAttributeNames: ticketExpattrName,
        ExpressionAttributeValues: ticketExpattrValue,
    };


    const jobDataUpdate: JobData = {
        type: DB_UPDATE,
        params: updateParams
    }

    const writeJob = await addJobToWriteQueue(jobDataUpdate);
    await writeJob.finished();

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

    const putParams: PutCommandInput = {
        TableName: CONTRACT_TABLE,
        Item: contractItem
    };

    const putJobData: JobData = {
        type: DB_PUT,
        params: putParams
    }

    const writeJobContract = await addJobToWriteQueue(putJobData);
    await writeJobContract.finished();

    const WEB_SOCKET_URL = String(process.env.WEB_SOCKET_URL);
    const ws = new WebSocket(WEB_SOCKET_URL);
    ws.on("open", () => {
        const message = JSON.stringify({ action: "refreshcompany" });
        ws.send(message);
    });
    ws.close();

    return {
        Status: "Success",
        Tender_id: tenderId,
        Contract_id: contractId,
    };
};

export const rejectTender = async (senderData: AcceptOrRejectTenderData) => {
    await clearRedisCache();

    const params: QueryCommandInput = {
        TableName: TENDERS_TABLE,
        IndexName: "company_id-index",
        KeyConditionExpression: "company_id = :company_id",
        FilterExpression: "ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":company_id": senderData.company_id,
            ":ticket_id": senderData.ticket_id
        },
    };

    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    }

    const readJob = await addJobToReadQueue(jobData);
    const responseTender = await readJob.finished() as QueryCommandOutput;

    const tenderItems = responseTender.Items;
    if (!tenderItems || tenderItems.length === 0) {
        throw new BadRequestError("Tender Does not Exist");
    }

    const tenderId = tenderItems[0].tender_id;
    const updateExp = "set #status = :r";
    const expattrName = { "#status": "status" };
    const expattrValue = { ":r": "rejected" };

    const WEB_SOCKET_URL = String(process.env.WEB_SOCKET_URL);
    const ws = new WebSocket(WEB_SOCKET_URL);
    ws.on("open", () => {
        const message = JSON.stringify({ action: "refreshcompany" });
        ws.send(message);
    });
    ws.close();

    try {
        const response = await updateTenderTable(tenderId, updateExp, expattrName, expattrValue);
        return {
            Status: "Success",
            Tender_id: tenderId,
        };
    }
    catch (error: any) {
        throw new Error("Error occurred trying to update");
    }
};

export const completeContract = async (senderData: { contract_id: string }) => {
    await clearRedisCache();

    const params: GetCommandInput = {
        TableName: CONTRACT_TABLE,
        Key: {
            contract_id: senderData.contract_id
        }
    };

    const jobData: JobData = {
        type: DB_GET,
        params: params
    }

    const readJob = await addJobToReadQueue(jobData);
    const responseContract = await readJob.finished() as GetCommandOutput;
    const contractItem = responseContract.Item;
    if (!contractItem) {
        throw new BadRequestError("Contract Does not Exist");
    }

    const updateExp = "set #status = :r";
    const expattrName = { "#status": "status" };
    const expattrValue = { ":r": "completed" };

    try {
        await updateContractTable(senderData.contract_id, updateExp, expattrName, expattrValue);
    }
    catch (error: any) {
        throw new Error("Error occurred trying to update");
    }

    // editing ticket to closed
    const getTenderParams: GetCommandInput = {
        TableName: TENDERS_TABLE,
        Key: {
            tender_id: contractItem.tender_id
        }
    };

    const jobDataTender: JobData = {
        type: DB_GET,
        params: getTenderParams
    }

    const readJobTender = await addJobToReadQueue(jobDataTender);
    const responseTender = await readJobTender.finished() as GetCommandOutput;

    const tenderItem = responseTender.Item;
    if (tenderItem) {
        const updateExpT = "set #status = :r";
        const expattrNameT = { "#status": "status" };
        const expattrValueT = { ":r": "completed" };

        try {
            await updateTenderTable(tenderItem.tender_id, updateExpT, expattrNameT, expattrValueT);
        }
        catch (error: any) {
            throw new Error("Error occurred trying to update");
        }
    }

    // editing ticket as well to In Progress
    return {
        Status: "Success",
        Contract_id: senderData.contract_id,
    };
};

export const terminateContract = async (senderData: { contract_id: string }) => {
    await clearRedisCache();

    const params: GetCommandInput = {
        TableName: CONTRACT_TABLE,
        Key: {
            contract_id: senderData.contract_id
        }
    };

    const jobData: JobData = {
        type: DB_GET,
        params: params
    }

    const readJob = await addJobToReadQueue(jobData);
    const responseContract = await readJob.finished() as GetCommandOutput;

    const contractItem = responseContract.Item;
    if (!contractItem) {
        throw new BadRequestError("Contract Does not Exist");
    }

    const updateExp = "set #status = :r";
    const expattrName = { "#status": "status" };
    const expattrValue = { ":r": "closed" };

    try {
        await updateContractTable(senderData.contract_id, updateExp, expattrName, expattrValue);
    }
    catch (error: any) {
        throw new Error("Error occurred trying to update");
    }

    const getTenderParams: GetCommandInput = {
        TableName: TENDERS_TABLE,
        Key: {
            tender_id: contractItem.tender_id
        }
    };

    const jobDataTender: JobData = {
        type: DB_GET,
        params: getTenderParams
    }

    const readJobTender = await addJobToReadQueue(jobDataTender);
    const responseTender = await readJobTender.finished() as GetCommandOutput;

    const tenderItem = responseTender.Item;
    if (tenderItem) {
        const updateExpTender = "set #status = :r";
        const expattrNameTender = { "#status": "status" };
        const expattrValueTender = { ":r": "rejected" };

        try {
            await updateTenderTable(tenderItem.tender_id, updateExpTender, expattrNameTender, expattrValueTender);
        }
        catch (error: any) {
            throw new Error("Error occurred trying to update");
        }

        const queryTicketParams: QueryCommandInput = {
            TableName: TICKETS_TABLE,
            KeyConditionExpression: "ticket_id = :ticket_id",
            ExpressionAttributeValues: {
                ":ticket_id": tenderItem.ticket_id
            }
        };

        const jobDataTicket: JobData = {
            type: DB_QUERY,
            params: queryTicketParams
        }

        const readJobTicket = await addJobToReadQueue(jobDataTicket);
        const responseTicket = await readJobTicket.finished() as QueryCommandOutput;

        if (responseTicket.Items && responseTicket.Items.length > 0) {
            const ticketChange = responseTicket.Items[0];
            const currentTime = new Date().toISOString();
            const updateExpT = "set #state = :r, #updatedAt = :u";
            const expattrNameT = { "#state": "state", "#updatedAt": "updatedAt" };
            const expattrValueT = { ":r": "Taking Tenders", ":u": currentTime };

            try {
                await updateTicketTable(ticketChange.ticket_id, ticketChange.dateOpened, updateExpT, expattrNameT, expattrValueT);
            }
            catch (error: any) {
                throw new Error("Error occurred trying to update");
            }
        }
    }

    return {
        Status: "Success",
        Contract_id: senderData.contract_id,
    };
};

export const doneContract = async (senderData: { contract_id: string }) => {
    await clearRedisCache();

    const params: GetCommandInput = {
        TableName: CONTRACT_TABLE,
        Key: {
            contract_id: senderData.contract_id
        }
    };

    const jobData: JobData = {
        type: DB_GET,
        params: params
    }

    const readJob = await addJobToReadQueue(jobData);
    const responseContract = await readJob.finished() as GetCommandOutput;

    const contractItem = responseContract.Item;
    if (!contractItem) {
        throw new BadRequestError("Contract Does not Exist");
    }

    const updateExp = "set #status = :r, #completedatetime = :c";
    const expattrName = { "#status": "status", "#completedatetime": "completedatetime" };
    const currentTime = new Date();
    const submittedTime = currentTime.toISOString();
    const expattrValue = { ":r": "done", ":c": submittedTime };

    try {
        await updateContractTable(senderData.contract_id, updateExp, expattrName, expattrValue);
    }
    catch (error: any) {
        throw new Error("Error occurred trying to update");
    }

    const getTenderParams: GetCommandInput = {
        TableName: TENDERS_TABLE,
        Key: {
            tender_id: contractItem.tender_id
        }
    };

    const jobDataTender: JobData = {
        type: DB_GET,
        params: getTenderParams
    }

    const readJobTender = await addJobToReadQueue(jobDataTender);
    const responseTender = await readJobTender.finished() as GetCommandOutput;

    const tender = responseTender.Item;
    if (tender) {
        const queryTicketParams: QueryCommandInput = {
            TableName: TICKETS_TABLE,
            KeyConditionExpression: "ticket_id = :ticket_id",
            ExpressionAttributeValues: {
                ":ticket_id": tender.ticket_id
            }
        };

        const jobDataTicket: JobData = {
            type: DB_QUERY,
            params: queryTicketParams
        }

        const readJobTicket = await addJobToReadQueue(jobDataTicket);
        const responseTicket = await readJobTicket.finished() as QueryCommandOutput

        if (responseTicket.Items && responseTicket.Items.length > 0) {
            const ticketChange = responseTicket.Items[0];
            const updateExpT = "set #state = :r, #updatedAt = :u";
            const expattrNameT = { "#state": "state", "#updatedAt": "updatedAt" };
            const currentTime = new Date().toISOString();
            const expattrValueT = { ":r": "Closed", ":u": currentTime };

            try {
                await updateTicketTable(ticketChange.ticket_id, ticketChange.dateOpened, updateExpT, expattrNameT, expattrValueT);
            }
            catch (error: any) {
                throw new Error("Error occurred trying to update");
            }
        }
    }

    return {
        Status: "Success",
        Contract_id: senderData.contract_id,
    };
};

export const didMakeTender = async (companyname: string, ticketId: string) => {
    const companyId = await getCompanyIDFromName(companyname);

    const params: QueryCommandInput = {
        TableName: TENDERS_TABLE,
        IndexName: "company_id-index",
        KeyConditionExpression: "company_id = :company_id",
        FilterExpression: "ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":company_id": companyId,
            ":ticket_id": ticketId
        }
    };

    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    }

    const readJob = await addJobToReadQueue(jobData);
    const responseTender = await readJob.finished() as QueryCommandOutput;

    if (responseTender.Items && responseTender.Items.length > 0) {
        const tender = responseTender.Items[0];
        await assignCompanyName([tender]);
        await assignLongLat([tender]);
        await assignMuni([tender]);
        return tender;
    } else {
        return {
            Status: "NotFound",
            Message: "Company hasn't bid for ticket"
        };
    }
};

export const getMunicipalityTenders = async (municipality: string, cacheKey: string) => {
    const paramsTickets: QueryCommandInput = {
        TableName: TICKETS_TABLE,
        IndexName: "municipality_id-dateOpened-index",
        KeyConditionExpression: "municipality_id = :municipality_id",
        ExpressionAttributeValues: {
            ":municipality_id": municipality
        },
        ScanIndexForward: false, // sort in descending order (from most recent ticket to oldest)
    };

    const ticketsJobData: JobData = {
        type: DB_QUERY,
        params: paramsTickets
    }

    const ticketsReadJob = await addJobToReadQueue(ticketsJobData);
    const responseTickets = await ticketsReadJob.finished() as QueryCommandOutput;

    if (!responseTickets.Items || responseTickets.Items.length === 0) {
        throw new NotFoundError("There are no tickets in this municipality");
    }

    const collective: any[] = [];
    const tickets = responseTickets.Items;

    for (const item of tickets) {
        const paramsTender: QueryCommandInput = {
            TableName: TENDERS_TABLE,
            IndexName: "ticket_id-index",
            KeyConditionExpression: "ticket_id = :ticket_id",
            ExpressionAttributeValues: {
                ":ticket_id": item.ticket_id || ""
            }
        };

        const tendersJobData: JobData = {
            type: DB_QUERY,
            params: paramsTender
        }

        const readJobTender = await addJobToReadQueue(tendersJobData);
        const responseTender = await readJobTender.finished() as QueryCommandOutput;

        if (responseTender.Items && responseTender.Items.length > 0) {
            await assignMuni(responseTender.Items);
            await assignLongLat(responseTender.Items);
            await assignCompanyName(responseTender.Items);
            collective.push(...responseTender.Items);
        }
    }

    return collective;
};

export const getCompanyTenders = async (company_name: string, cacheKey: string) => {
    const companyId = await getCompanyIDFromName(company_name);
    if (!companyId) {
        throw new NotFoundError("Company doesn't exist");
    }

    const params: QueryCommandInput = {
        TableName: TENDERS_TABLE,
        IndexName: "company_id-datetimesubmitted-index",
        KeyConditionExpression: "company_id = :company_id",
        ExpressionAttributeValues: {
            ":company_id": companyId
        },
        ScanIndexForward : false,
    };

    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    }

    const readJob = await addJobToReadQueue(jobData);
    const responseTenders = await readJob.finished() as QueryCommandOutput;
    const items = responseTenders.Items || [];
    await assignCompanyName(items);
    await assignLongLat(items);
    await assignMuni(items);

    return items;
};

export const getTicketTender = async (ticket_id: string, cacheKey: string) => {
    const params: QueryCommandInput = {
        TableName: TENDERS_TABLE,
        IndexName: "ticket_id-index",
        KeyConditionExpression: "ticket_id = :ticket_id",
        ExpressionAttributeValues: {
            ":ticket_id": ticket_id
        },
    };

    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    }

    const readJob = await addJobToReadQueue(jobData);
    const responseTender = await readJob.finished() as QueryCommandOutput;

    const items = responseTender.Items || [];
    if (items.length === 0) {
        throw new NotFoundError("Tender does not exist");
    }

    await assignCompanyName(items);
    await assignLongLat(items);
    await assignMuni(items);

    return items;
};

export const getContracts = async (tender_id: string, cacheKey: string) => {
    const params: QueryCommandInput = {
        TableName: CONTRACT_TABLE,
        IndexName: "tender_id-index",
        KeyConditionExpression: "tender_id = :tender_id",
        ExpressionAttributeValues: {
            ":tender_id": tender_id
        },
    };

    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    }

    const readJob = await addJobToReadQueue(jobData);
    const responseContracts = await readJob.finished() as QueryCommandOutput;
    const contractItems = responseContracts.Items || [];
    if (contractItems.length === 0) {
        throw new NotFoundError("Contract does not exist");
    }

    const paramsTender: QueryCommandInput = {
        TableName: TENDERS_TABLE,
        KeyConditionExpression: "tender_id = :tender_id",
        ExpressionAttributeValues: {
            ":tender_id": tender_id
        },
    };

    const jobDataTender: JobData = {
        type: DB_QUERY,
        params: paramsTender
    }

    const readJobTender = await addJobToReadQueue(jobDataTender);
    const responseTender = await readJobTender.finished() as QueryCommandOutput;

    const tenderItems = responseTender.Items || [];
    if (tenderItems.length === 0) {
        throw new NotFoundError("Tender does not exist");
    }

    const tenderItem = tenderItems[0];

    const paramsName = {
        TableName: COMPANIES_TABLE,
        KeyConditionExpression: "pid = :pid",
        ExpressionAttributeValues: {
            ":pid": tenderItem.company_id
        },
    };

    const jobDataName: JobData = {
        type: DB_QUERY,
        params: paramsName
    }

    const readJobName = await addJobToReadQueue(jobDataName);
    const responseName = await readJobName.finished() as QueryCommandOutput;

    const companyItems = responseName.Items || [];
    if (companyItems.length === 0) {
        contractItems[0].companyname = "Xero Industries";
    } else {
        const company = companyItems[0];
        contractItems[0].companyname = company.name;
    }

    return contractItems[0];
};

export const getMuniContract = async (ticket_id: string, cacheKey: string) => {
    const params: QueryCommandInput = {
        TableName: TENDERS_TABLE,
        IndexName: "ticket_id-index",
        KeyConditionExpression: "ticket_id = :ticket_id",
        FilterExpression: "#status IN (:approved, :accepted, :completed)",
        ExpressionAttributeNames: {
            "#status": "status"
        },
        ExpressionAttributeValues: {
            ":ticket_id": ticket_id,
            ":approved": "approved",
            ":accepted": "accepted",
            ":completed": "completed"
        }
    };

    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    }

    const readJob = await addJobToReadQueue(jobData);
    const responseTender = await readJob.finished() as QueryCommandOutput;

    if (!responseTender.Items || responseTender.Items.length === 0) {
        throw new NotFoundError("There's no tenders for this ticket");
    }

    const tender = responseTender.Items[0];

    const paramsContracts: QueryCommandInput = {
        TableName: CONTRACT_TABLE,
        IndexName: "tender_id-index",
        KeyConditionExpression: "tender_id = :tender_id",
        ExpressionAttributeValues: {
            ":tender_id": tender.tender_id
        }
    }

    const jobDataContracts: JobData = {
        type: DB_QUERY,
        params: paramsContracts
    }

    const readJobContracts = await addJobToReadQueue(jobDataContracts);
    const responseContracts = await readJobContracts.finished() as QueryCommandOutput

    if (!responseContracts.Items || responseContracts.Items.length === 0) {
        throw new NotFoundError("Contract does not exist");
    }

    const contractItem = responseContracts.Items[0];

    const paramsTenderDetails = {
        TableName: TENDERS_TABLE,
        KeyConditionExpression: "tender_id = :tender_id",
        ExpressionAttributeValues: {
            ":tender_id": tender.tender_id
        }
    }

    const jobDataTenderDetails: JobData = {
        type: DB_QUERY,
        params: paramsTenderDetails
    }

    const readJobTenderDetails = await addJobToReadQueue(jobDataTenderDetails);
    const responseTenderDetails = await readJobTenderDetails.finished() as QueryCommandOutput;

    if (!responseTenderDetails.Items || responseTenderDetails.Items.length === 0) {
        throw new NotFoundError("Tender does not exist");
    }

    const tenderItem = responseTenderDetails.Items[0];

    const paramsCompanyName = {
        TableName: COMPANIES_TABLE,
        KeyConditionExpression: "pid = :pid",
        ExpressionAttributeValues: {
            ":pid": tenderItem.company_id
        }
    }

    const jobDataCompanyName: JobData = {
        type: DB_QUERY,
        params: paramsCompanyName
    }

    const readJobCompanyName = await addJobToReadQueue(jobDataCompanyName);
    const responseCompanyName = await readJobCompanyName.finished() as QueryCommandOutput;

    if (!responseCompanyName.Items || responseCompanyName.Items.length === 0) {
        contractItem.companyname = "Xero Industries";
    } else {
        const company = responseCompanyName.Items[0];
        contractItem.companyname = company.name;
    }

    return contractItem;
};

export const getCompanyContracts = async (tender_id: string, company_name: string, cacheKey: string) => {
    const companyId = await getCompanyIDFromName(company_name);
    if (!companyId) {
        throw new NotFoundError("Company doesn't exist");
    }

    const paramsContracts: QueryCommandInput = {
        TableName: CONTRACT_TABLE,
        IndexName: "tender_id-index",
        KeyConditionExpression: "tender_id = :tender_id",
        ExpressionAttributeValues: {
            ":tender_id": tender_id
        },
    };

    const jobDataContracts: JobData = {
        type: DB_QUERY,
        params: paramsContracts
    }

    const readJobContracts = await addJobToReadQueue(jobDataContracts);
    const responseContracts = await readJobContracts.finished() as QueryCommandOutput;
    const contractItems = responseContracts.Items || [];
    if (contractItems.length === 0) {
        throw new NotFoundError("Contract does not exist");
    }

    const paramsTender: QueryCommandInput = {
        TableName: TENDERS_TABLE,
        KeyConditionExpression: "tender_id = :tender_id",
        FilterExpression: "company_id = :company_id",
        ExpressionAttributeValues: {
            ":tender_id": tender_id,
            ":company_id": companyId
        },
    };

    const jobDataTender: JobData = {
        type: DB_QUERY,
        params: paramsTender
    }

    const readJobTender = await addJobToReadQueue(jobDataTender);
    const responseTender = await readJobTender.finished() as QueryCommandOutput;
    const tenderItems = responseTender.Items || [];
    if (tenderItems.length === 0) {
        throw new NotFoundError("Company never bid on tender");
    }

    const tenderItem = tenderItems[0];

    const paramsName: QueryCommandInput = {
        TableName: COMPANIES_TABLE,
        KeyConditionExpression: "pid = :pid",
        ExpressionAttributeValues: {
            ":pid": tenderItem.company_id
        },
    };

    const jobDataName: JobData = {
        type: DB_QUERY,
        params: paramsName
    }

    const readJobName = await addJobToReadQueue(jobDataName);
    const responseName = await readJobName.finished() as QueryCommandOutput;
    const companyItems = responseName.Items || [];
    if (companyItems.length === 0) {
        contractItems[0].companyname = "Xero Industries";
    } else {
        const company = companyItems[0];
        contractItems[0].companyname = company.name;
    }

    return contractItems[0];
};

export const getCompanyFromTicketContracts = async (ticket_id: string, company_name: string, cacheKey: string) => {
    const companyId = await getCompanyIDFromName(company_name);
    if (!companyId) {
        throw new NotFoundError("Company doesn't exist");
    }

    const paramsTender: QueryCommandInput = {
        TableName: TENDERS_TABLE,
        IndexName: "ticket_id-index",
        KeyConditionExpression: "ticket_id = :ticket_id",
        FilterExpression: "company_id = :company_id",
        ExpressionAttributeValues: {
            ":ticket_id": ticket_id,
            ":company_id": companyId
        },
    };

    const jobDataTender: JobData = {
        type: DB_QUERY,
        params: paramsTender
    }

    const readJobTender = await addJobToReadQueue(jobDataTender);
    const responseTender = await readJobTender.finished() as QueryCommandOutput;
    if (!responseTender.Items || responseTender.Items.length <= 0) {
        throw new NotFoundError("Company doesn't have a tender on this ticket");
    }

    const tender = responseTender.Items[0];

    const paramsContracts: QueryCommandInput = {
        TableName: CONTRACT_TABLE,
        IndexName: "tender_id-index",
        KeyConditionExpression: "tender_id = :tender_id",
        ExpressionAttributeValues: {
            ":tender_id": tender.tender_id
        },
    };

    const jobDataContracts: JobData = {
        type: DB_QUERY,
        params: paramsContracts
    }

    const readJobContracts = await addJobToReadQueue(jobDataContracts);
    const responseContracts = await readJobContracts.finished() as QueryCommandOutput;
    if (!responseContracts.Items || responseContracts.Items.length <= 0) {
        throw new NotFoundError("Contract does not exist");
    }

    const contract = responseContracts.Items[0];

    const paramsName: GetCommandInput = {
        TableName: COMPANIES_TABLE,
        Key: {
            pid: tender.company_id
        },
    };

    const jobDataName: JobData = {
        type: DB_GET,
        params: paramsName
    }

    const readJobName = await addJobToReadQueue(jobDataName);
    const responseName = await readJobName.finished() as GetCommandOutput;
    if (!responseName.Item) {
        contract.companyname = "Xero Industries";
    } else {
        const company = responseName.Item;
        contract.companyname = company.name;
    }

    return contract;
};