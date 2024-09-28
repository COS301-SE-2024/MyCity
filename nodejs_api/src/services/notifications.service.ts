import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ClientError } from "../types/error.types";
import { dynamoDBDocumentClient, NOTIFICATIONS_TABLE } from "../config/dynamodb.config";

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

    const response = await dynamoDBDocumentClient.send(new PutCommand({
        TableName: NOTIFICATIONS_TABLE,
        Item: notificationItem,
    }));

    const accresponse = { message: "Notification Token Saved", token };
    return accresponse;
};

export const getNotificationTokens = async (username: string) => {
    const response = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: NOTIFICATIONS_TABLE,
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": username
        }
    }));

    const items = response.Items || [];
    if (items.length > 0) {
        return items;
    } else {
        throw new ClientError({ Error: { Code: "NoTokens", Message: "User does not have any notification tokens" } }, "NoTokens");
    }
};
