import { addJobToReadQueue, addJobToWriteQueue } from "../../src/services/jobs.service";
import * as notificationService from "../../src/services/notifications.service";
import { ClientError } from "../../src/types/error.types";


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

            (addJobToWriteQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue({}) }); // Mock successful PutCommand response


            const result = await notificationService.insertNotificationToken(mockTokenData);

            expect(result).toEqual({ message: "Notification Token Saved", token: "tokenABC" });
            expect(addJobToWriteQueue).toHaveBeenCalledWith(expect.objectContaining({
                params: {
                    TableName: "notifications",
                    Item: {
                        username: "testUser",
                        deviceID: "device123",
                        token: "tokenABC",
                        subscriptions: ["status", "upvotes", "comments"],
                        date: expect.any(String), // Check if date is a valid string
                    },
                }
            }));
            expect(addJobToWriteQueue).toHaveBeenCalledTimes(1);
        });

        it("should throw an error if inserting the token fails", async () => {
            const mockTokenData = {
                username: "testUser",
                deviceID: "device123",
                token: "tokenABC",
            };

            (addJobToWriteQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockRejectedValue(new Error("DynamoDB error")) }); // Mock error response

            await expect(notificationService.insertNotificationToken(mockTokenData)).rejects.toThrow("DynamoDB error");
            expect(addJobToWriteQueue).toHaveBeenCalled();
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

            (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue(mockResponse) }); // Mock successful QueryCommand response

            const result = await notificationService.getNotificationTokens(mockUsername);

            expect(result).toEqual(mockResponse.Items);
            expect(addJobToReadQueue).toHaveBeenCalledWith(expect.objectContaining({
                params: {
                    TableName: "notifications",
                    KeyConditionExpression: "username = :username",
                    ExpressionAttributeValues: {
                        ":username": mockUsername,
                    },
                }
            }));
            expect(addJobToReadQueue).toHaveBeenCalledTimes(1);
        });

        it("should throw a ClientError if no tokens are found for the user", async () => {
            const mockUsername = "testUser";
            const mockResponse = {
                Items: [],
            };

            (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue(mockResponse) }); // Mock no tokens response

            await expect(notificationService.getNotificationTokens(mockUsername)).rejects.toThrow(ClientError);
            await expect(notificationService.getNotificationTokens(mockUsername)).rejects.toThrow("NoTokens");
            expect(addJobToReadQueue).toHaveBeenCalled();
        });
    });
});
