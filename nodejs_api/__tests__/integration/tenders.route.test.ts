import request from "supertest";
import { app } from "../../app";
import * as tendersService from "../../src/services/tenders.service";
import { BadRequestError, NotFoundError } from "../../src/types/error.types";

describe("Integration Test - /tenders", () => {

    describe("POST /create", () => {
        test("should create a new tender", async () => {
            const validTenderData = {
                company_name: "Test Company",
                quote: "50000",
                ticket_id: "ticket123",
                duration: "5"
            };

            const mockServiceResponse = {
                Status: "Success",
                message: "Tender created successfully",
                tender_id: "tender987"
            };
            jest.spyOn(tendersService, "createTender").mockResolvedValue(mockServiceResponse);

            const response = await request(app)
                .post("/tenders/create")
                .send(validTenderData);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockServiceResponse);

            expect(tendersService.createTender).toHaveBeenCalledWith(validTenderData);
        });

        test("should return 400 if required fields are missing", async () => {
            const invalidTenderData = {
                company_name: "Test Company",
                // Missing quote, ticket_id, and duration fields
            };

            const response = await request(app)
                .post("/tenders/create")
                .send(invalidTenderData);

            expect(response.statusCode).toBe(400);
            expect(response.body.Error).toBe("Missing parameter(s): quote, ticket_id, duration");
        });

        test("should return 400 if company already has a tender on the ticket", async () => {
            const validTenderData = {
                company_name: "Test Company",
                quote: "50000",
                ticket_id: "ticket123",
                duration: "5"
            };

            jest.spyOn(tendersService, "createTender").mockRejectedValue(
                new BadRequestError("Company already has a tender on this Ticket")
            );

            const response = await request(app)
                .post("/tenders/create")
                .send(validTenderData);

            expect(response.statusCode).toBe(400);
            expect(response.body.Error).toBe("Company already has a tender on this Ticket");
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe("POST /in-review", () => {
        test("should mark a tender as in review", async () => {
            const validReviewData = {
                company_name: "Test Company",
                ticket_id: "ticket123",
            };
    
            jest.spyOn(tendersService, "inReview").mockResolvedValue({
                Status: "Success",
                Message: "Tender updated successfully"
            });
    
            const response = await request(app)
                .post("/tenders/in-review")
                .send(validReviewData);
    
            expect(response.statusCode).toBe(200);
            expect(response.body.Status).toBe("Success");
            expect(response.body.Message).toBe("Tender updated successfully");
        });

        test("should return 400 if company does not exist", async () => {
            const invalidCompanyData = {
                company_name: "Invalid Company",
                ticket_id: "ticket123",
            };
    
            jest.spyOn(tendersService, "inReview").mockRejectedValue(
                new BadRequestError("Company Does not Exist")
            );
    
            const response = await request(app)
                .post("/tenders/in-review")
                .send(invalidCompanyData);
    
            expect(response.statusCode).toBe(400);
            expect(response.body.Error).toBe("Company Does not Exist");
        });
    
        test("should return 404 if tender does not exist", async () => {
            const invalidTenderData = {
                company_name: "Test Company",
                ticket_id: "invalidTicket",
            };

            jest.spyOn(tendersService, "inReview").mockRejectedValue(
                new NotFoundError("Tender Does not Exist")
            );
    
            const response = await request(app)
                .post("/tenders/in-review")
                .send(invalidTenderData);
    
            expect(response.statusCode).toBe(404);
            expect(response.body.Error).toBe("Tender Does not Exist");
        });
    
        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe("POST /accept", () => {
        test("should accept a tender and create a contract", async () => {
            const validAcceptData = {
                company_id: "company123",
                ticket_id: "ticket123",
            };
    
            jest.spyOn(tendersService, "acceptTender").mockResolvedValue({
                Status: "Success",
                Tender_id: "tender123",
                Contract_id: "contract456",
            });
    
            const response = await request(app)
                .post("/tenders/accept")
                .send(validAcceptData);
    
            expect(response.statusCode).toBe(200);
            expect(response.body.Status).toBe("Success");
            expect(response.body.Tender_id).toBe("tender123");
            expect(response.body.Contract_id).toBe("contract456");
        });
    
        test("should return 400 if required fields are missing", async () => {
            const invalidData = {
                company_id: "company123",
                // ticket_id is missing
            };
    
            const response = await request(app)
                .post("/tenders/accept")
                .send(invalidData);
    
            expect(response.statusCode).toBe(400);
            expect(response.body.Error).toBe("Missing parameter(s): ticket_id");
        });

        test("should return 400 if the tender does not exist", async () => {
            const nonExistentTenderData = {
                company_id: "company123",
                ticket_id: "invalidTicket",
            };
    
            jest.spyOn(tendersService, "acceptTender").mockRejectedValue(
                new BadRequestError("Tender Does not Exist")
            );
    
            const response = await request(app)
                .post("/tenders/accept")
                .send(nonExistentTenderData);
    
            expect(response.statusCode).toBe(400);
            expect(response.body.Error).toBe("Tender Does not Exist");
        });
    
        test("should return 404 if company or tender is not found", async () => {
            const invalidCompanyOrTender = {
                company_id: "nonExistentCompany",
                ticket_id: "invalidTicket",
            };
    
            jest.spyOn(tendersService, "acceptTender").mockRejectedValue(
                new NotFoundError("Company or Tender not found")
            );
    
            const response = await request(app)
                .post("/tenders/accept")
                .send(invalidCompanyOrTender);
    
            expect(response.statusCode).toBe(404);
            expect(response.body.Error).toBe("Company or Tender not found");
        });
    
        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe("POST /reject", () => {
        test("should reject a tender successfully", async () => {
            const validRejectData = {
                company_id: "company123",
                ticket_id: "ticket123",
            };
    
            jest.spyOn(tendersService, "rejectTender").mockResolvedValue({
                Status: "Success",
                Tender_id: "tender123",
            });
    
            const response = await request(app)
                .post("/tenders/reject")
                .send(validRejectData);
    
            expect(response.statusCode).toBe(200);
            expect(response.body.Status).toBe("Success");
            expect(response.body.Tender_id).toBe("tender123");
        });
    
        test("should return 400 if required fields are missing", async () => {
            const invalidData = {
                company_id: "company123",
                // ticket_id is missing
            };
    
            const response = await request(app)
                .post("/tenders/reject")
                .send(invalidData);
    
            expect(response.statusCode).toBe(400);
            expect(response.body.Error).toBe("Missing parameter(s): ticket_id");
        });
    
        test("should return 400 if the tender does not exist", async () => {
            const nonExistentTenderData = {
                company_id: "company123",
                ticket_id: "invalidTicket",
            };
    
            jest.spyOn(tendersService, "rejectTender").mockRejectedValue(
                new BadRequestError("Tender Does not Exist")
            );
    
            const response = await request(app)
                .post("/tenders/reject")
                .send(nonExistentTenderData);
    
            expect(response.statusCode).toBe(400);
            expect(response.body.Error).toBe("Tender Does not Exist");
        });
    
        test("should return 404 if company or tender is not found", async () => {
            const invalidCompanyOrTender = {
                company_id: "nonExistentCompany",
                ticket_id: "invalidTicket",
            };
    
            jest.spyOn(tendersService, "rejectTender").mockRejectedValue(
                new NotFoundError("Company or Tender not found")
            );
    
            const response = await request(app)
                .post("/tenders/reject")
                .send(invalidCompanyOrTender);
    
            expect(response.statusCode).toBe(404);
            expect(response.body.Error).toBe("Company or Tender not found");
        });
    
        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe("POST /completed", () => {
        test("should mark a contract as completed successfully", async () => {
            const validContractData = {
                contract_id: "contract123",
            };
    
            jest.spyOn(tendersService, "completeContract").mockResolvedValue({
                Status: "Success",
                Contract_id: "contract123",
            });
    
            const response = await request(app)
                .post("/tenders/completed")
                .send(validContractData);
    
            expect(response.statusCode).toBe(200);
            expect(response.body.Status).toBe("Success");
            expect(response.body.Contract_id).toBe("contract123");
        });
    
        test("should return 400 if required fields are missing", async () => {
            const invalidData = {
                // Missing contract_id
            };
    
            const response = await request(app)
                .post("/tenders/completed")
                .send(invalidData);
    
            expect(response.statusCode).toBe(400);
            expect(response.body.Error).toBe("Missing parameter(s): contract_id");
        });
    
        test("should return 400 if the contract does not exist", async () => {
            const nonExistentContractData = {
                contract_id: "invalidContract",
            };
    
            jest.spyOn(tendersService, "completeContract").mockRejectedValue(
                new BadRequestError("Contract Does not Exist")
            );
    
            const response = await request(app)
                .post("/tenders/completed")
                .send(nonExistentContractData);
    
            expect(response.statusCode).toBe(400);
            expect(response.body.Error).toBe("Contract Does not Exist");
        });
    
        test("should return 404 if contract or related tender is not found", async () => {
            const invalidContractData = {
                contract_id: "nonExistentContract",
            };
    
            jest.spyOn(tendersService, "completeContract").mockRejectedValue(
                new NotFoundError("Contract or related Tender not found")
            );
    
            const response = await request(app)
                .post("/tenders/completed")
                .send(invalidContractData);
    
            expect(response.statusCode).toBe(404);
            expect(response.body.Error).toBe("Contract or related Tender not found");
        });
    
        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe("POST /terminate", () => {
        test("should terminate a contract successfully", async () => {
            const validContractData = {
                contract_id: "contract123",
            };
    
            jest.spyOn(tendersService, "terminateContract").mockResolvedValue({
                Status: "Success",
                Contract_id: "contract123",
            });
    
            const response = await request(app)
                .post("/tenders/terminate")
                .send(validContractData);
    
            expect(response.statusCode).toBe(200);
            expect(response.body.Status).toBe("Success");
            expect(response.body.Contract_id).toBe("contract123");
        });
    
        test("should return 400 if required fields are missing", async () => {
            const invalidData = {
                // Missing contract_id
            };
    
            const response = await request(app)
                .post("/tenders/terminate")
                .send(invalidData);
    
            expect(response.statusCode).toBe(400);
            expect(response.body.Error).toBe("Missing parameter(s): contract_id");
        });
    
        test("should return 400 if the contract does not exist", async () => {
            const nonExistentContractData = {
                contract_id: "invalidContract",
            };
    
            jest.spyOn(tendersService, "terminateContract").mockRejectedValue(
                new BadRequestError("Contract Does not Exist")
            );
    
            const response = await request(app)
                .post("/tenders/terminate")
                .send(nonExistentContractData);
    
            expect(response.statusCode).toBe(400);
            expect(response.body.Error).toBe("Contract Does not Exist");
        });
    
        test("should return 404 if contract or related tender is not found", async () => {
            const invalidContractData = {
                contract_id: "nonExistentContract",
            };
    
            jest.spyOn(tendersService, "terminateContract").mockRejectedValue(
                new NotFoundError("Contract or related Tender not found")
            );
    
            const response = await request(app)
                .post("/tenders/terminate")
                .send(invalidContractData);
    
            expect(response.statusCode).toBe(404);
            expect(response.body.Error).toBe("Contract or related Tender not found");
        });
    
        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe("POST /done", () => {
        test("should mark a contract as done successfully", async () => {
            const validContractData = {
                contract_id: "contract123",
            };
    
            jest.spyOn(tendersService, "doneContract").mockResolvedValue({
                Status: "Success",
                Contract_id: "contract123",
            });
    
            const response = await request(app)
                .post("/tenders/done")
                .send(validContractData);
    
            expect(response.statusCode).toBe(200);
            expect(response.body.Status).toBe("Success");
            expect(response.body.Contract_id).toBe("contract123");
        });
    
        test("should return 400 if required fields are missing", async () => {
            const invalidData = {
                // Missing contract_id
            };
    
            const response = await request(app)
                .post("/tenders/done")
                .send(invalidData);
    
            expect(response.statusCode).toBe(400);
            expect(response.body.Error).toBe("Missing parameter(s): contract_id");
        });
    
        test("should return 400 if the contract does not exist", async () => {
            const nonExistentContractData = {
                contract_id: "invalidContract",
            };
    
            jest.spyOn(tendersService, "doneContract").mockRejectedValue(
                new BadRequestError("Contract Does not Exist")
            );
    
            const response = await request(app)
                .post("/tenders/done")
                .send(nonExistentContractData);
    
            expect(response.statusCode).toBe(400);
            expect(response.body.Error).toBe("Contract Does not Exist");
        });
    
        test("should return 404 if contract or related tender is not found", async () => {
            const invalidContractData = {
                contract_id: "nonExistentContract",
            };
    
            jest.spyOn(tendersService, "doneContract").mockRejectedValue(
                new NotFoundError("Contract or related Tender not found")
            );
    
            const response = await request(app)
                .post("/tenders/done")
                .send(invalidContractData);
    
            expect(response.statusCode).toBe(404);
            expect(response.body.Error).toBe("Contract or related Tender not found");
        });
    
        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe("POST /didbid", () => {
        test("should confirm if a bid was made by the company", async () => {
            const validData = {
                companyname: "TechCorp",
                ticket_id: "ticket123",
            };
    
            jest.spyOn(tendersService, "didMakeTender").mockResolvedValue({
                companyname: "TechCorp",
                ticket_id: "ticket123",
                Status: "Found",
                Message: "Company has bid for ticket"
            });
    
            const response = await request(app)
                .post("/tenders/didbid")
                .send(validData);
    
            expect(response.statusCode).toBe(200);
            expect(response.body.companyname).toBe("TechCorp");
            expect(response.body.ticket_id).toBe("ticket123");
            expect(response.body.Status).toBe("Found");
            expect(response.body.Message).toBe("Company has bid for ticket");
        });
    
        test("should return NotFound if the company hasn't bid for the ticket", async () => {
            const validData = {
                companyname: "TechCorp",
                ticket_id: "ticket123",
            };
    
            jest.spyOn(tendersService, "didMakeTender").mockResolvedValue({
                Status: "NotFound",
                Message: "Company hasn't bid for ticket",
            });
    
            const response = await request(app)
                .post("/tenders/didbid")
                .send(validData);
    
            expect(response.statusCode).toBe(200);
            expect(response.body.Status).toBe("NotFound");
            expect(response.body.Message).toBe("Company hasn't bid for ticket");
        });
    
        test("should return 400 if required fields are missing", async () => {
            const invalidData = {
                companyname: "TechCorp", // Missing ticket_id
            };
    
            const response = await request(app)
                .post("/tenders/didbid")
                .send(invalidData);
    
            expect(response.statusCode).toBe(400);
            expect(response.body.Error).toBe("Missing parameter(s): ticket_id");
        });
    
        test("should return 400 if the company does not exist", async () => {
            const validData = {
                companyname: "InvalidCorp",
                ticket_id: "ticket123",
            };
    
            jest.spyOn(tendersService, "didMakeTender").mockRejectedValue(
                new BadRequestError("Company does not exist")
            );
    
            const response = await request(app)
                .post("/tenders/didbid")
                .send(validData);
    
            expect(response.statusCode).toBe(400);
            expect(response.body.Error).toBe("Company does not exist");
        });
    
        test("should return 404 if the company or ticket is not found", async () => {
            const validData = {
                companyname: "TechCorp",
                ticket_id: "ticketNotFound",
            };
    
            jest.spyOn(tendersService, "didMakeTender").mockRejectedValue(
                new NotFoundError("Company or ticket not found")
            );
    
            const response = await request(app)
                .post("/tenders/didbid")
                .send(validData);
    
            expect(response.statusCode).toBe(404);
            expect(response.body.Error).toBe("Company or ticket not found");
        });
    
        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

});
