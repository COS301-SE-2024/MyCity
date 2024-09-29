import { Request, Response } from "express";
import * as tendersController from "../../src/controllers/tenders.controller";
import * as tendersService from "../../src/services/tenders.service";
import { BadRequestError, NotFoundError } from "../../src/types/error.types";

jest.mock("../../src/services/tenders.service");

describe("tenders controller controller", () => {
    const req: Partial<Request> = {}; // partial mock request
    const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    }; 

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createTender", () => {
        it("should return 400 if required fields are missing", async () => {
            req.body = { company_name: "Company A" }; // Missing fields
            await tendersController.createTender(req as Request, res as Response);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                Error: "Missing parameter(s): quote, ticket_id, duration",
            });
        });

        it("should call tendersService.createTender and return 200 on success", async () => {
            req.body = {
                company_name: "Company A",
                quote: 1000,
                ticket_id: 1,
                duration: "30 days",
            };
            const serviceResponse = { success: true };
            (tendersService.createTender as jest.Mock).mockResolvedValue(serviceResponse);

            await tendersController.createTender(req as Request, res as Response);

            expect(tendersService.createTender).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(serviceResponse);
        });

        it("should handle NotFoundError", async () => {
            req.body = {
                company_name: "Company A",
                quote: 1000,
                ticket_id: 1,
                duration: "30 days",
            };
            const error = new NotFoundError("Tender not found");
            (tendersService.createTender as jest.Mock).mockRejectedValue(error);

            await tendersController.createTender(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ Error: "Tender not found" });
        });

        it("should handle BadRequestError", async () => {
            req.body = {
                company_name: "Company A",
                quote: 1000,
                ticket_id: 1,
                duration: "30 days",
            };
            const error = new BadRequestError("Invalid input");
            (tendersService.createTender as jest.Mock).mockRejectedValue(error);

            await tendersController.createTender(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ Error: "Invalid input" });
        });

        it("should handle unexpected errors", async () => {
            req.body = {
                company_name: "Company A",
                quote: 1000,
                ticket_id: 1,
                duration: "30 days",
            };
            const error = new Error("Unexpected error");
            (tendersService.createTender as jest.Mock).mockRejectedValue(error);

            await tendersController.createTender(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: "Unexpected error" });
        });
    });


    describe("inReview", () => {
        it("should return 400 if required fields are missing", async () => {
            req.body = { company_name: "Company A" }; // Missing fields
            await tendersController.inReview(req as Request, res as Response);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                Error: "Missing parameter(s): ticket_id",
            });
        });

        it("should call tendersService.inReview and return 200 on success", async () => {
            req.body = {
                company_name: "Company A",
                ticket_id: 1,
            };
            const serviceResponse = [{ id: 1, status: "In Review" }];
            (tendersService.inReview as jest.Mock).mockResolvedValue(serviceResponse);

            await tendersController.inReview(req as Request, res as Response);

            expect(tendersService.inReview).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(serviceResponse);
        });

        it("should handle NotFoundError", async () => {
            req.body = {
                company_name: "Company A",
                ticket_id: 1,
            };
            const error = new NotFoundError("Tender not found");
            (tendersService.inReview as jest.Mock).mockRejectedValue(error);

            await tendersController.inReview(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ Error: "Tender not found" });
        });

        it("should handle BadRequestError", async () => {
            req.body = {
                company_name: "Company A",
                ticket_id: 1,
            };
            const error = new BadRequestError("Invalid input");
            (tendersService.inReview as jest.Mock).mockRejectedValue(error);

            await tendersController.inReview(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ Error: "Invalid input" });
        });

        it("should handle unexpected errors", async () => {
            req.body = {
                company_name: "Company A",
                ticket_id: 1,
            };
            const error = new Error("Unexpected error");
            (tendersService.inReview as jest.Mock).mockRejectedValue(error);

            await tendersController.inReview(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: "Unexpected error" });
        });
    });

    describe("acceptTender", () => {
    });


    describe("rejectTender", () => {
    });


    describe("completeContract", () => {
    });


    describe("terminateContract", () => {
    });


    describe("doneContract", () => {
    });


    describe("didMakeTender", () => {
    });


    describe("getCompanyTenders", () => {
    });

    describe("getMunicipalityTenders", () => {
    });


    describe("getTicketTender", () => {
    });


    describe("getContracts", () => {
    });


    describe("getMuniContract", () => {
    });

    describe("getCompanyContracts ", () => {
    });

    describe("getCompanyContractByTicket", () => {
    });

});