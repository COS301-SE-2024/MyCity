import request from "supertest";
import { app } from "../../app";
import * as notificationsService from "../../src/services/notifications.service";

jest.mock("../../src/services/notifications.service");

describe("Integration Test - /notifications", () => {

    describe("GET /get-tokens", () => {
        test("should return a list of notification tokens", async () => {
            const mockResponse = [
                { username: "user1", deviceID: "device1", date: "2022-01-01T00:00:00.000Z", subscriptions: [{ "S": "status" }, { "S": "upvotes" }, { "S": "comments" }], token: "token1" },
                { username: "user2", deviceID: "device2", date: "2022-01-01T00:00:00.000Z", subscriptions: [{ "S": "status" }, { "S": "upvotes" }, { "S": "comments" }], token: "token2" },
                { username: "user3", deviceID: "device3", date: "2022-01-01T00:00:00.000Z", subscriptions: [{ "S": "status" }, { "S": "upvotes" }, { "S": "comments" }], token: "token3" },
            ];
            jest.spyOn(notificationsService, "getNotificationTokens").mockResolvedValue(mockResponse);

            const response = await request(app).get("/notifications/get-tokens?username=user1");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockResponse);
            expect(notificationsService.getNotificationTokens).toHaveBeenCalledTimes(1);
        });
    });

});
