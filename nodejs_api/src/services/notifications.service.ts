import { PutCommand, PutCommandInput, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { ClientError } from "../types/error.types";
import { dynamoDBDocumentClient, NOTIFICATIONS_TABLE } from "../config/dynamodb.config";
import { deleteAllCache } from "../config/redis.config";

interface TokenData {
    username: string;
    deviceID: string;
    token: string;
}

export const insertNotificationToken = async (tokenData: TokenData) => {
    await deleteAllCache();

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

    try {
        const command = new PutCommand(params);
        await dynamoDBDocumentClient.send(command);
        const accresponse = { message: "Notification Token Saved", token };
        return accresponse;
    }
    catch (error: any) {
        throw error;
    }
};

export const getNotificationTokens = async (username: string) => {
    const params: QueryCommandInput = {
        TableName: NOTIFICATIONS_TABLE,
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": username
        }
    };

    const readCommand = new QueryCommand(params);
    const response = await dynamoDBDocumentClient.send(readCommand);
    const items = response.Items || [];

    if (items.length > 0) {
        return items;
    } else {
        throw new ClientError({ Error: { Code: "NoTokens", Message: "User does not have any notification tokens" } }, "NoTokens");
    }
};
