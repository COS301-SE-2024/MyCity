import { PutCommand, PutCommandInput, QueryCommand, QueryCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { dynamoDBDocumentClient, GIVEAWAY_TABLE, TICKETS_TABLE } from "../config/dynamodb.config";
import { deleteCacheKey } from "../config/redis.config";
import { CustomError } from "../errors/CustomError";

export const getParticipantCount = async () => {
    const params: ScanCommandInput = {
        TableName: GIVEAWAY_TABLE,
        Select: "COUNT"
    };

    const command = new ScanCommand(params);
    const response = await dynamoDBDocumentClient.send(command);

    return {
        count: response.Count || 0
    };
};

export const addParticipant = async (formData: any) => {
    await deleteCacheKey("/giveaway/participant/count");

    // verify that provided ticketNumber exists
    const params: QueryCommandInput = {
        TableName: TICKETS_TABLE,
        IndexName: "ticketnumber-index",
        KeyConditionExpression: "ticketnumber = :ticketnumber",
        ExpressionAttributeValues: {
            ":ticketnumber": formData.ticketNumber
        }
    };

    const queryCommand = new QueryCommand(params);
    const queryResponse = await dynamoDBDocumentClient.send(queryCommand);

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

    const putItemCommand = new PutCommand(putItemParams);
    await dynamoDBDocumentClient.send(putItemCommand);

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

        const queryParticipantCommand = new QueryCommand(queryParticipantParams);
        const queryParticipantResponse = await dynamoDBDocumentClient.send(queryParticipantCommand);

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