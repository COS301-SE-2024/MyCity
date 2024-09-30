import { PutCommandInput, QueryCommandInput, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { ClientError } from "../types/error.types";
import { NOTIFICATIONS_TABLE } from "../config/dynamodb.config";
import { addJobToReadQueue, addJobToWriteQueue } from "./jobs.service";
import { DB_PUT, DB_QUERY } from "../config/redis.config";
import { JobData } from "../types/job.types";

interface TokenData {
    username: string;
    deviceID: string;
    token: string;
}

export const insertNotificationToken = async (tokenData: TokenData) => {
    const { username, deviceID, token } = tokenData;
    const currentDatetime = new Date().toISOString();
    const subscriptions = ["status", "upvotes", "comments"];

    const notificationItem = {
        username: username,
        deviceID: deviceID,
        token: token,
        subscriptions: subscriptions,
        date: currentDatetime
    };

    const params: PutCommandInput = {
        TableName: NOTIFICATIONS_TABLE,
        Item: notificationItem
    };

    const jobData: JobData = {
        type: DB_PUT,
        params: params
    }

    const writeJob = await addJobToWriteQueue(jobData);
    try {
        await writeJob.finished();
        const accresponse = { message: "Notification Token Saved", token };
        return accresponse;
    }
    catch (error: any) {
        throw error;
    }
};

export const getNotificationTokens = async (username: string, cacheKey: string) => {
    const params: QueryCommandInput = {
        TableName: NOTIFICATIONS_TABLE,
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": username
        }
    };

    const jobData: JobData = {
        type: DB_QUERY,
        params: params,
        cacheKey: cacheKey
    }


    const readJob = await addJobToReadQueue(jobData);
    const response = await readJob.finished() as QueryCommandOutput;
    const items = response.Items || [];

    if (items.length > 0) {
        return items;
    } else {
        throw new ClientError({ Error: { Code: "NoTokens", Message: "User does not have any notification tokens" } }, "NoTokens");
    }
};
