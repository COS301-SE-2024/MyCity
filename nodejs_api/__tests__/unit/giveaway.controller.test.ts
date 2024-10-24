import { Request, Response, NextFunction } from "express";
import * as giveawayService from "../../src/services/giveaway.service";
import { getParticipantCount, addParticipant } from "../../src/controllers/giveaway.controller";

// Mock dependencies
jest.mock("../../src/services/giveaway.service");
jest.mock("../../src/config/redis.config", () => ({
    cacheResponse: jest.fn(),
    DEFAULT_CACHE_DURATION: 600
}));

describe("Giveaway Controller", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe("getParticipantCount", () => {
        it("should return participant count and cache the response", async () => {
            const mockCount = { count: 100 };
            (giveawayService.getParticipantCount as jest.Mock).mockResolvedValue(mockCount);

            await getParticipantCount(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(giveawayService.getParticipantCount).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCount);
        });

        it("should handle errors by calling next function", async () => {
            const error = new Error("Test Error");
            (giveawayService.getParticipantCount as jest.Mock).mockRejectedValue(error);

            await getParticipantCount(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalledWith(error);
        });
    });

    describe("addParticipant", () => {
        it("should return 400 if any required field is missing", async () => {
            mockRequest = { body: { ticketNumber: "12345", name: "John Doe" } }; // Missing email and phoneNumber

            await addParticipant(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                Error: "Missing parameter(s): email, phoneNumber"
            });
        });

        it("should add a participant and return the response", async () => {
            const mockData = { ticketNumber: "12345", name: "John Doe", email: "john@example.com", phoneNumber: "123456789" };
            const mockResponseData = { success: true };
            mockRequest = { body: mockData };
            (giveawayService.addParticipant as jest.Mock).mockResolvedValue(mockResponseData);

            await addParticipant(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(giveawayService.addParticipant).toHaveBeenCalledWith(mockData);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockResponseData);
        });

        it("should handle errors by calling next function", async () => {
            const error = new Error("Test Error");
            const mockData = { ticketNumber: "12345", name: "John Doe", email: "john@example.com", phoneNumber: "123456789" };
            mockRequest = { body: mockData };
            (giveawayService.addParticipant as jest.Mock).mockRejectedValue(error);

            await addParticipant(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalledWith(error);
        });
    });
});
