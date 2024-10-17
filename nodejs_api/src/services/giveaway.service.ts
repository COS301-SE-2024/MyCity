import { PutCommandInput, PutCommandOutput, QueryCommandInput, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import { dynamoDBDocumentClient, GIVEAWAY_TABLE, TICKETS_TABLE } from "../config/dynamodb.config";
import { addJobToReadQueue, addJobToWriteQueue } from "./jobs.service";
import { JobData } from "../types/job.types";
import { DB_PUT, DB_QUERY } from "../config/redis.config";
import { CustomError } from "../errors/CustomError";

export const getParticipantCount = async () => {
    const command = new DescribeTableCommand({
        TableName: GIVEAWAY_TABLE
    });

    const response = await dynamoDBDocumentClient.send(command);
    return {
        count: response.Table?.ItemCount || 0
    };
};

export const addParticipant = async ({ formData }: any) => {
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
        params
    }

    const queryJob = await addJobToReadQueue(queryTicketJobData);
    const queryResponse = await queryJob.finished() as QueryCommandOutput;

    if (queryResponse.Items?.length === 0) {
        throw new CustomError("Invalid ticket number provided", 400);
    }

    // generate a unique entry id
    const entryId = await generateEntryId();

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

        const queryParticipantJob = await addJobToWriteQueue(jobData);
        const queryParticipantResponse = await queryParticipantJob.finished() as QueryCommandOutput;

        if (queryParticipantResponse.Items?.length === 0) {
            participantExists = false;
            return entryId;
        } else {
            entryId = Math.random().toString(36).substring(2, 5).toUpperCase() + "-" + Math.floor(100 + Math.random() * 900);
        }

        attempts++;
    }
};