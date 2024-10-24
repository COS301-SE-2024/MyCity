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
        beforeEach(() => {
            req.originalUrl = "/tenders/create";
        });

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
        beforeEach(() => {
            req.originalUrl = "/tenders/in-review";
        });

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
        beforeEach(() => {
            req.originalUrl = "/tenders/accept";
        });

        it("should return 400 if required fields are missing", async () => {
            req.body = { company_id: "1" }; // Missing fields
            await tendersController.acceptTender(req as Request, res as Response);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                Error: "Missing parameter(s): ticket_id",
            });
        });

        it("should call tendersService.acceptTender and return 200 on success", async () => {
            req.body = {
                company_id: "1",
                ticket_id: "123",
            };
            const serviceResponse = { success: true };
            (tendersService.acceptTender as jest.Mock).mockResolvedValue(serviceResponse);

            await tendersController.acceptTender(req as Request, res as Response);

            expect(tendersService.acceptTender).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(serviceResponse);
        });

        it("should handle NotFoundError", async () => {
            req.body = {
                company_id: "1",
                ticket_id: "123",
            };
            const error = new NotFoundError("Tender not found");
            (tendersService.acceptTender as jest.Mock).mockRejectedValue(error);

            await tendersController.acceptTender(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ Error: "Tender not found" });
        });

        it("should handle BadRequestError", async () => {
            req.body = {
                company_id: "1",
                ticket_id: "123",
            };
            const error = new BadRequestError("Invalid input");
            (tendersService.acceptTender as jest.Mock).mockRejectedValue(error);

            await tendersController.acceptTender(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ Error: "Invalid input" });
        });

        it("should handle unexpected errors", async () => {
            req.body = {
                company_id: "1",
                ticket_id: "123",
            };
            const error = new Error("Unexpected error");
            (tendersService.acceptTender as jest.Mock).mockRejectedValue(error);

            await tendersController.acceptTender(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: "Unexpected error" });
        });
    });


    describe("rejectTender", () => {
        beforeEach(() => {
            req.originalUrl = "/tenders/reject";
        });

        it("should return 400 if required fields are missing", async () => {
            req.body = { company_id: "1" }; // Missing fields
            await tendersController.rejectTender(req as Request, res as Response);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                Error: "Missing parameter(s): ticket_id",
            });
        });

        it("should call tendersService.rejectTender and return 200 on success", async () => {
            req.body = {
                company_id: "1",
                ticket_id: "123",
            };
            const serviceResponse = { success: true };
            (tendersService.rejectTender as jest.Mock).mockResolvedValue(serviceResponse);

            await tendersController.rejectTender(req as Request, res as Response);

            expect(tendersService.rejectTender).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(serviceResponse);
        });

        it("should handle NotFoundError", async () => {
            req.body = {
                company_id: "1",
                ticket_id: "123",
            };
            const error = new NotFoundError("Tender not found");
            (tendersService.rejectTender as jest.Mock).mockRejectedValue(error);

            await tendersController.rejectTender(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ Error: "Tender not found" });
        });

        it("should handle BadRequestError", async () => {
            req.body = {
                company_id: "1",
                ticket_id: "123",
            };
            const error = new BadRequestError("Invalid input");
            (tendersService.rejectTender as jest.Mock).mockRejectedValue(error);

            await tendersController.rejectTender(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ Error: "Invalid input" });
        });

        it("should handle unexpected errors", async () => {
            req.body = {
                company_id: "1",
                ticket_id: "123",
            };
            const error = new Error("Unexpected error");
            (tendersService.rejectTender as jest.Mock).mockRejectedValue(error);

            await tendersController.rejectTender(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: "Unexpected error" });
        });
    });


    describe("completeContract", () => {
        beforeEach(() => {
            req.originalUrl = "/tenders/completed";
        });

        it("should return 400 if required fields are missing", async () => {
            req.body = { company_id: "1" }; // Missing fields
            await tendersController.completeContract(req as Request, res as Response);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                Error: "Missing parameter(s): contract_id",
            });
        });
    
        it("should call tendersService.completeContract and return 200 on success", async () => {
            req.body = {
                company_id: "1",
                contract_id: "123",
            };
            const serviceResponse = { success: true };
            (tendersService.completeContract as jest.Mock).mockResolvedValue(serviceResponse);
    
            await tendersController.completeContract(req as Request, res as Response);
    
            expect(tendersService.completeContract).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(serviceResponse);
        });
    
        it("should handle NotFoundError", async () => {
            req.body = {
                company_id: "1",
                contract_id: "123",
            };
            const error = new NotFoundError("Contract not found");
            (tendersService.completeContract as jest.Mock).mockRejectedValue(error);
    
            await tendersController.completeContract(req as Request, res as Response);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ Error: "Contract not found" });
        });
    
        it("should handle BadRequestError", async () => {
            req.body = {
                company_id: "1",
                contract_id: "123",
            };
            const error = new BadRequestError("Invalid input");
            (tendersService.completeContract as jest.Mock).mockRejectedValue(error);
    
            await tendersController.completeContract(req as Request, res as Response);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ Error: "Invalid input" });
        });
    
        it("should handle unexpected errors", async () => {
            req.body = {
                company_id: "1",
                contract_id: "123",
            };
            const error = new Error("Unexpected error");
            (tendersService.completeContract as jest.Mock).mockRejectedValue(error);
    
            await tendersController.completeContract(req as Request, res as Response);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: "Unexpected error" });
        });
    });


    describe("terminateContract", () => {
        beforeEach(() => {
            req.originalUrl = "/tenders/terminate";
        });

        it("should return 400 if required fields are missing", async () => {
            req.body = { company_id: "1" }; // Missing fields
            await tendersController.terminateContract(req as Request, res as Response);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                Error: "Missing parameter(s): contract_id",
            });
        });
    
        it("should call tendersService.terminateContract and return 200 on success", async () => {
            req.body = {
                company_id: "1",
                contract_id: "123",
            };
            const serviceResponse = { success: true };
            (tendersService.terminateContract as jest.Mock).mockResolvedValue(serviceResponse);
    
            await tendersController.terminateContract(req as Request, res as Response);
    
            expect(tendersService.terminateContract).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(serviceResponse);
        });
    
        it("should handle NotFoundError", async () => {
            req.body = {
                company_id: "1",
                contract_id: "123",
            };
            const error = new NotFoundError("Contract not found");
            (tendersService.terminateContract as jest.Mock).mockRejectedValue(error);
    
            await tendersController.terminateContract(req as Request, res as Response);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ Error: "Contract not found" });
        });
    
        it("should handle BadRequestError", async () => {
            req.body = {
                company_id: "1",
                contract_id: "123",
            };
            const error = new BadRequestError("Invalid input");
            (tendersService.terminateContract as jest.Mock).mockRejectedValue(error);
    
            await tendersController.terminateContract(req as Request, res as Response);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ Error: "Invalid input" });
        });
    
        it("should handle unexpected errors", async () => {
            req.body = {
                company_id: "1",
                contract_id: "123",
            };
            const error = new Error("Unexpected error");
            (tendersService.terminateContract as jest.Mock).mockRejectedValue(error);
    
            await tendersController.terminateContract(req as Request, res as Response);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: "Unexpected error" });
        });
    });


    describe("doneContract", () => {
        beforeEach(() => {
            req.originalUrl = "/tenders/done";
        });

        it("should return 400 if required fields are missing", async () => {
            req.body = { company_id: "1" }; // Missing fields
            await tendersController.doneContract(req as Request, res as Response);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                Error: "Missing parameter(s): contract_id",
            });
        });
    
        it("should call tendersService.doneContract and return 200 on success", async () => {
            req.body = {
                company_id: "1",
                contract_id: "123",
            };
            const serviceResponse = { success: true };
            (tendersService.doneContract as jest.Mock).mockResolvedValue(serviceResponse);
    
            await tendersController.doneContract(req as Request, res as Response);
    
            expect(tendersService.doneContract).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(serviceResponse);
        });
    
        it("should handle NotFoundError", async () => {
            req.body = {
                company_id: "1",
                contract_id: "123",
            };
            const error = new NotFoundError("Contract not found");
            (tendersService.doneContract as jest.Mock).mockRejectedValue(error);
    
            await tendersController.doneContract(req as Request, res as Response);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ Error: "Contract not found" });
        });
    
        it("should handle BadRequestError", async () => {
            req.body = {
                company_id: "1",
                contract_id: "123",
            };
            const error = new BadRequestError("Invalid input");
            (tendersService.doneContract as jest.Mock).mockRejectedValue(error);
    
            await tendersController.doneContract(req as Request, res as Response);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ Error: "Invalid input" });
        });
    
        it("should handle unexpected errors", async () => {
            req.body = {
                company_id: "1",
                contract_id: "123",
            };
            const error = new Error("Unexpected error");
            (tendersService.doneContract as jest.Mock).mockRejectedValue(error);
    
            await tendersController.doneContract(req as Request, res as Response);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: "Unexpected error" });
        });
    });

});