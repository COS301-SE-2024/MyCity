import { Request, Response } from "express";
import * as ticketsController from "../../src/controllers/tickets.controller";
import * as ticketsService from "../../src/services/tickets.service";

jest.mock("../../src/services/tickets.service");

describe("tickets controller - getFaultTypes", () => {
    const req: Partial<Request> = {}; // partial mock request
    const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    }; // partial mock response

    test("should return fault types on absence of error", async () => {
        const mockResult = [{ asset_id: "1", assetIcon: "icon", multiplier: 1 }];
        (ticketsService.getFaultTypes as jest.Mock).mockResolvedValue(mockResult); // mock service response

        await ticketsController.getFaultTypes(req as Request, res as Response); // cast to full Request and Response

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    test("should return 500 on internal server error", async () => {
        const mockError = new Error("Internal server error");
        (ticketsService.getFaultTypes as jest.Mock).mockRejectedValue(mockError);

        await ticketsController.getFaultTypes(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
    });
});