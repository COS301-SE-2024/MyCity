import * as notificationService from "../../src/services/notifications.service";
import { dynamoDBDocumentClient } from "../../src/config/dynamodb.config";
import { ClientError } from "../../src/types/error.types";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

// Mock the entire AWS SDK module
jest.mock("@aws-sdk/lib-dynamodb", () => ({
    PutCommand: jest.fn(),
    QueryCommand: jest.fn(),
    DynamoDBDocumentClient: {
        from: jest.fn(() => ({
            send: jest.fn(),
        })),
    },
}));

describe("Notification Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("insertNotificationToken", () => {
        it("should insert a notification token successfully", async () => {
            const mockTokenData = {
                username: "testUser",
                deviceID: "device123",
                token: "tokenABC",
            };

            (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce({}); // Mock successful PutCommand response

            const result = await notificationService.insertNotificationToken(mockTokenData);

            expect(result).toEqual({ message: "Notification Token Saved", token: "tokenABC" });
            expect(PutCommand).toHaveBeenCalledWith({
                TableName: "notifications",
                Item: {
                    username: "testUser",
                    deviceID: "device123",
                    token: "tokenABC",
                    subscriptions: ["status", "upvotes", "comments"],
                    date: expect.any(String), // Check if date is a valid string
                },
            });
            expect(dynamoDBDocumentClient.send).toHaveBeenCalled();
        });

        it("should throw an error if inserting the token fails", async () => {
            const mockTokenData = {
                username: "testUser",
                deviceID: "device123",
                token: "tokenABC",
            };

            (dynamoDBDocumentClient.send as jest.Mock).mockRejectedValueOnce(new Error("DynamoDB error")); // Mock error response

            await expect(notificationService.insertNotificationToken(mockTokenData)).rejects.toThrow("DynamoDB error");
            expect(dynamoDBDocumentClient.send).toHaveBeenCalled();
        });
    });

    describe("getNotificationTokens", () => {
        it("should return notification tokens for a given user", async () => {
            const mockUsername = "testUser";
            const mockResponse = {
                Items: [
                    { username: "testUser", deviceID: "device123", token: "tokenABC" },
                    { username: "testUser", deviceID: "device456", token: "tokenXYZ" },
                ],
            };

            (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce(mockResponse); // Mock successful QueryCommand response

            const result = await notificationService.getNotificationTokens(mockUsername);

            expect(result).toEqual(mockResponse.Items);
            expect(QueryCommand).toHaveBeenCalledWith({
                TableName: "notifications",
                KeyConditionExpression: "username = :username",
                ExpressionAttributeValues: {
                    ":username": mockUsername,
                },
            });
            expect(dynamoDBDocumentClient.send).toHaveBeenCalled();
        });

        it("should throw a ClientError if no tokens are found for the user", async () => {
            const mockUsername = "testUser";
            const mockResponse = {
                Items: [],
            };

            (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce(mockResponse); // Mock no tokens response

            await expect(notificationService.getNotificationTokens(mockUsername)).rejects.toThrow(ClientError);
            await expect(notificationService.getNotificationTokens(mockUsername)).rejects.toThrow("Cannot read properties of undefined (reading 'Items')");
            expect(dynamoDBDocumentClient.send).toHaveBeenCalled();
        });
    });
});
