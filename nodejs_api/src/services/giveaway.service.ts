import { PutCommandInput, PutCommandOutput, QueryCommandInput, QueryCommandOutput, ScanCommandInput, ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { GIVEAWAY_TABLE, TICKETS_TABLE } from "../config/dynamodb.config";
import { addJobToReadQueue, addJobToWriteQueue } from "./jobs.service";
import { JobData } from "../types/job.types";
import { DB_PUT, DB_QUERY, DB_SCAN } from "../config/redis.config";
import { CustomError } from "../errors/CustomError";

export const getParticipantCount = async () => {
    const params: ScanCommandInput = {
        TableName: GIVEAWAY_TABLE,
        Select: "COUNT"
    };

    const jobData: JobData = {
        type: DB_SCAN,
        params
    }

    const job = await addJobToReadQueue(jobData);
    const response = await job.finished() as ScanCommandOutput;

    return {
        count: response.Count || 0
    };
};

export const addParticipant = async (formData: any) => {
    // verify that provided ticketNumber exists
    const params: QueryCommandInput = {
        TableName: TICKETS_TABLE,
        IndexName: "ticketnumber-index",
        KeyConditionExpression: "ticketnumber = :ticketnumber",
        ExpressionAttributeValues: {
            ":ticketnumber": formData.ticketNumber
        }
    };

    const queryTicketJobData: JobData = {
        type: DB_QUERY,
        params: params
    }

    const queryJob = await addJobToReadQueue(queryTicketJobData);
    const queryResponse = await queryJob.finished() as QueryCommandOutput;

    if (queryResponse.Items?.length === 0) {
        throw new CustomError("Invalid ticket number provided", 400);
    }

    // generate a unique entry id
    const entryId = await generateEntryId();

    if (!entryId) {
        throw new CustomError("There are no more free slots for participants", 500);
    }

    const participantDetails = {
        entryid: entryId,
        date: new Date().toISOString(),
        email: formData.email,
        name: formData.name,
        number: formData.phoneNumber,
        ticketNumber: formData.ticketNumber
    };

    const putItemParams: PutCommandInput = {
        TableName: GIVEAWAY_TABLE,
        Item: participantDetails
    };

    const jobData: JobData = {
        type: DB_PUT,
        params: putItemParams
    }


    const putItemJob = await addJobToWriteQueue(jobData);
    const putItemResponse = await putItemJob.finished() as PutCommandOutput;

    return {
        message: "Participant added successfully",
        entryid: entryId
    }
};

const generateEntryId = async () => {
    const MAX_ATTEMPTS = 20;
    let attempts = 0;
    let entryId = Math.random().toString(36).substring(2, 5).toUpperCase() + "-" + Math.floor(100 + Math.random() * 900);

    // ensure entryId is unique
    let participantExists = true;
    while (participantExists && attempts < MAX_ATTEMPTS) {
        const queryParticipantParams: QueryCommandInput = {
            TableName: GIVEAWAY_TABLE,
            KeyConditionExpression: "entryid = :entryid",
            ExpressionAttributeValues: {
                ":entryid": entryId
            }
        };

        const jobData: JobData = {
            type: DB_QUERY,
            params: queryParticipantParams
        }

        const queryParticipantJob = await addJobToReadQueue(jobData);
        const queryParticipantResponse = await queryParticipantJob.finished() as QueryCommandOutput;

        if (queryParticipantResponse.Items?.length === 0) {
            participantExists = false;
            return entryId;
        } else {
            entryId = Math.random().toString(36).substring(2, 5).toUpperCase() + "-" + Math.floor(100 + Math.random() * 900);
        }

        attempts++;
    }

    return null;
};