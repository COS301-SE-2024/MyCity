import { Request, Response } from "express";
import * as notificationsController from "../../src/controllers/notifications.controller";
import * as notificationsService from "../../src/services/notifications.service";

jest.mock("../../src/services/notifications.service");

describe("Notifications Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe("insertNotificationToken", () => {
        test("should return 400 if required fields are missing", async () => {
            req.body = { username: "testUser" }; // Missing deviceID and token

            await notificationsController.insertNotificationToken(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ Error: "Missing parameter(s): deviceID, token" });
        });

        test("should return 200 and the response on success", async () => {
            req.body = { username: "testUser", deviceID: "device123", token: "token123" };
            const mockResponse = { success: true };
            (notificationsService.insertNotificationToken as jest.Mock).mockResolvedValue(mockResponse);

            await notificationsController.insertNotificationToken(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });

        test("should return 500 on internal server error", async () => {
            req.body = { username: "testUser", deviceID: "device123", token: "token123" };
            const mockError = new Error("Internal server error");
            (notificationsService.insertNotificationToken as jest.Mock).mockRejectedValue(mockError);

            await notificationsController.insertNotificationToken(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });

    describe("getNotificationTokens", () => {
        test("should return 400 if username is missing", async () => {
            req.query = {}; // No username

            await notificationsController.getNotificationTokens(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ Error: "Missing parameter: username" });
        });

        test("should return 200 and the notification tokens on success", async () => {
            req.query = { username: "testUser" };
            const mockResponse = [{ token: "token123" }, { token: "token456" }];
            (notificationsService.getNotificationTokens as jest.Mock).mockResolvedValue(mockResponse);

            await notificationsController.getNotificationTokens(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });

        test("should return 500 on internal server error", async () => {
            req.query = { username: "testUser" };
            const mockError = new Error("Internal server error");
            (notificationsService.getNotificationTokens as jest.Mock).mockRejectedValue(mockError);

            await notificationsController.getNotificationTokens(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });
});
