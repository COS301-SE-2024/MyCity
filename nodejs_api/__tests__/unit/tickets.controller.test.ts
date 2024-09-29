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

    afterEach(() => {
        jest.clearAllMocks();
    });



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




    describe("viewTicketData", () => {
        test("should return 400 if ticket_id is missing", async () => {
            req.query = {}; // Missing ticket_id

            await ticketsController.viewTicketData(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ Error: "Missing parameter: ticket_id" });
        });

        test("should return 200 and ticket data on valid input", async () => {
            req.query = { ticket_id: "123" };
            const mockResult = { id: "123", description: "Test ticket" };
            (ticketsService.viewTicketData as jest.Mock).mockResolvedValue(mockResult);

            await ticketsController.viewTicketData(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        test("should return 500 on internal server error", async () => {
            req.query = { ticket_id: "123" };
            const mockError = new Error("Internal server error");
            (ticketsService.viewTicketData as jest.Mock).mockRejectedValue(mockError);

            await ticketsController.viewTicketData(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });



    describe("createTicket", () => {
        test("should return 400 if required fields are missing", async () => {
            req.body = { address: "123", asset: "asset" }; // Missing other fields

            await ticketsController.createTicket(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                Error: "Missing parameter(s): description, latitude, longitude, state, username",
            });
        });

        test("should return 200 and create ticket on valid input", async () => {
            req.body = {
                address: "123",
                asset: "asset",
                description: "description",
                latitude: 1,
                longitude: 2,
                state: "open",
                username: "user",
            };
            const mockResult = { id: "1", message: "Ticket created" };
            (ticketsService.createTicket as jest.Mock).mockResolvedValue(mockResult);

            await ticketsController.createTicket(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        test("should return 500 on internal server error", async () => {
            req.body = {
                address: "123",
                asset: "asset",
                description: "description",
                latitude: 1,
                longitude: 2,
                state: "open",
                username: "user",
            };
            const mockError = new Error("Internal server error");
            (ticketsService.createTicket as jest.Mock).mockRejectedValue(mockError);

            await ticketsController.createTicket(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });


    

});

