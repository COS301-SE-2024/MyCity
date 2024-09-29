import { Request, Response } from "express";
import * as watchlistController from "../../src/controllers/watchlist.controller";
import * as watchlistService from "../../src/services/watchlist.service";

jest.mock("../../src/services/watchlist.service");

describe("Watchlist Controller", () => {
    const req: Partial<Request> = {}; // partial mock request
    const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    }; // partial mock response

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("searchWatchlist", () => {
        it("should return 400 if search term is missing", async () => {
            req.query = {}; // Mock query to be empty

            await watchlistController.searchWatchlist(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ Error: "Missing parameter: q" });
        });

        it("should return 200 and the response on success", async () => {
            req.query = { q: "test" }; // Mock query with a valid search term
            const mockResponse = { success: true, data: [] }; // Mock response from service
            (watchlistService.searchWatchlist as jest.Mock).mockResolvedValue(mockResponse);

            await watchlistController.searchWatchlist(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });

        it("should return 500 on internal server error", async () => {
            req.query = { q: "test" }; // Mock query with a valid search term
            const mockError = new Error("Internal server error");
            (watchlistService.searchWatchlist as jest.Mock).mockRejectedValue(mockError);

            await watchlistController.searchWatchlist(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });
});
