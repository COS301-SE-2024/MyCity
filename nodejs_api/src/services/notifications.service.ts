import { PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { ClientError } from "../types/error.types";
import { dynamoDBClient, NOTIFICATIONS_TABLE } from "../config/dynamodb.config";
import { formatResponse } from "../utils/tickets.utils";

interface TokenData {
    username: string;
    deviceID: string;
    token: string;
}

export const insertNotificationToken = async (tokenData: TokenData) => {
    const requiredFields = ["username", "deviceID", "token"];

    for (const field of requiredFields) {
        if (!(field in tokenData)) {
            throw new ClientError({ Error: { Code: "BadRequest", Message: `${field} is required` } }, "BadRequestError");
        }
    }

    const { username, deviceID, token } = tokenData;
    const currentDatetime = new Date().toISOString();
    const subscriptions = ["status", "upvotes", "comments"];

    const notificationItem = {
        username: { S: username },
        deviceID: { S: deviceID },
        token: { S: token },
        subscriptions: { SS: subscriptions },
        date: { S: currentDatetime },
    };

    const response = await dynamoDBClient.send(new PutItemCommand({
        TableName: NOTIFICATIONS_TABLE,
        Item: notificationItem,
    }));

    const accresponse = { message: "Notification Token Saved", token };
    return formatResponse(200, accresponse);
};

export const getNotificationTokens = async (username: string) => {
    if (!username) {
        throw new ClientError({ Error: { Code: "IncorrectFields", Message: "Missing required field: username" } }, "InvalidFields");
    }

    const response = await dynamoDBClient.send(new QueryCommand({
        TableName: NOTIFICATIONS_TABLE,
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": { S: username },
        },
    }));

    const items = response.Items || [];
    if (items.length > 0) {
        return items;
    } else {
        throw new ClientError({ Error: { Code: "NoTokens", Message: "User does not have any notification tokens" } }, "NoTokens");
    }
};
