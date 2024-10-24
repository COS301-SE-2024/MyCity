import { Request, Response } from "express";
import * as ticketsController from "../../src/controllers/tickets.controller";
import * as ticketsService from "../../src/services/tickets.service";

jest.mock("../../src/services/tickets.service");

describe("tickets controller", () => {
    const req: Partial<Request> = {}; // partial mock request
    const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    }; // partial mock response

    afterEach(() => {
        jest.clearAllMocks();
    });


    describe("getFaultTypes", () => {
        beforeEach(() => {
            req.originalUrl = "/tickets/fault-types";
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
    });



    describe("viewTicketData", () => {
        beforeEach(() => {
            req.originalUrl = "/tickets/view";
        });

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
        beforeEach(() => {
            req.originalUrl = "/tickets/create";
        });

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


    describe("addWatchlist", () => {
        beforeEach(() => {
            req.originalUrl = "/tickets/addwatchlist";
        });

        test("should return 400 if required fields are missing", async () => {
            req.body = { username: "user" }; // Missing ticket_id

            await ticketsController.addWatchlist(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                Error: "Missing parameter(s): ticket_id",
            });
        });

        test("should return 200 and add to watchlist on valid input", async () => {
            req.body = { username: "user", ticket_id: "123" };
            const mockResult = { message: "Watchlist updated" };
            (ticketsService.addWatchlist as jest.Mock).mockResolvedValue(mockResult);

            await ticketsController.addWatchlist(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        test("should return 500 on internal server error", async () => {
            req.body = { username: "user", ticket_id: "123" };
            const mockError = new Error("Internal server error");
            (ticketsService.addWatchlist as jest.Mock).mockRejectedValue(mockError);

            await ticketsController.addWatchlist(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });



    describe("acceptTicket", () => {
        beforeEach(() => {
            req.originalUrl = "/tickets/accept";
        });

        test("should return 400 if required fields are missing", async () => {
            req.body = {}; // Missing ticket_id

            await ticketsController.acceptTicket(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                Error: "Missing parameter(s): ticket_id",
            });
        });

        test("should return 200 and accept ticket on valid input", async () => {
            req.body = { ticket_id: "123" };
            const mockResult = { message: "Ticket accepted" };
            (ticketsService.acceptTicket as jest.Mock).mockResolvedValue(mockResult);

            await ticketsController.acceptTicket(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        test("should return 500 on internal server error", async () => {
            req.body = { ticket_id: "123" };
            const mockError = new Error("Internal server error");
            (ticketsService.acceptTicket as jest.Mock).mockRejectedValue(mockError);

            await ticketsController.acceptTicket(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });



    describe("closeTicket", () => {
        beforeEach(() => {
            req.originalUrl = "/tickets/close";
        });

        test("should return 400 if required fields are missing", async () => {
            req.body = {}; // Missing ticket_id

            await ticketsController.closeTicket(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                Error: "Missing parameter(s): ticket_id",
            });
        });

        test("should return 200 and close ticket on valid input", async () => {
            req.body = { ticket_id: "123" };
            const mockResult = { message: "Ticket closed" };
            (ticketsService.closeTicket as jest.Mock).mockResolvedValue(mockResult);

            await ticketsController.closeTicket(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        test("should return 500 on internal server error", async () => {
            req.body = { ticket_id: "123" };
            const mockError = new Error("Internal server error");
            (ticketsService.closeTicket as jest.Mock).mockRejectedValue(mockError);

            await ticketsController.closeTicket(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });

    describe("getMyTickets", () => {
        beforeEach(() => {
            req.originalUrl = "/tickets/getmytickets";
        });

        test("should return 400 if username is missing", async () => {
            req.query = {}; // No username

            await ticketsController.getMyTickets(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ Error: "Missing parameter: username" });
        });

        test("should return 200 and call service on success", async () => {
            req.query = { username: "user1" };
            const mockResult = [{ ticket_id: 1, description: "test ticket" }];
            (ticketsService.getMyTickets as jest.Mock).mockResolvedValue(mockResult);

            await ticketsController.getMyTickets(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        test("should return 500 on internal server error", async () => {
            req.query = { username: "user1" };
            const mockError = new Error("Internal server error");
            (ticketsService.getMyTickets as jest.Mock).mockRejectedValue(mockError);

            await ticketsController.getMyTickets(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });


    describe("getOpenTicketsInMunicipality", () => {
        beforeEach(() => {
            req.originalUrl = "/tickets/getopeninarea";
        });


        test("should return 400 if municipality is missing", async () => {
            req.query = {}; // No municipality

            await ticketsController.getOpenTicketsInMunicipality(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ Error: "Missing parameter: municipality" });
        });

        test("should return 200 and call service on success", async () => {
            req.query = { municipality: "Test Municipality" };
            const mockResult = [{ ticket_id: 1, description: "test ticket" }];
            (ticketsService.getOpenTicketsInMunicipality as jest.Mock).mockResolvedValue(mockResult);

            await ticketsController.getOpenTicketsInMunicipality(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        test("should return 500 on internal server error", async () => {
            req.query = { municipality: "Test Municipality" };
            const mockError = new Error("Internal server error");
            (ticketsService.getOpenTicketsInMunicipality as jest.Mock).mockRejectedValue(mockError);

            await ticketsController.getOpenTicketsInMunicipality(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });


    describe("interactTicket", () => {
        beforeEach(() => {
            req.originalUrl = "/tickets/interact";
        });

        test("should return 400 if required fields are missing", async () => {
            req.body = {}; // No fields provided

            await ticketsController.interactTicket(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ Error: expect.stringContaining("Missing parameter(s):") });
        });
    });


    describe("getMostUpvotedTickets", () => {
        beforeEach(() => {
            req.originalUrl = "/tickets/getUpvotes";
        });

        test("should return 200 and call service on success", async () => {
            const mockResult = [{ ticket_id: 1, description: "test ticket" }];
            (ticketsService.getMostUpvoted as jest.Mock).mockResolvedValue(mockResult);

            await ticketsController.getMostUpvoted(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        test("should return 500 on internal server error", async () => {
            const mockError = new Error("Internal server error");
            (ticketsService.getMostUpvoted as jest.Mock).mockRejectedValue(mockError);

            await ticketsController.getMostUpvoted(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });



});

