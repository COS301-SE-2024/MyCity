// import { Request, Response } from "express";
// import * as analyticsController from "../../src/controllers/analytics.controller";
// import * as analyticsService from "../../src/services/analytics.service";

// jest.mock("../../src/services/analytics.service");

// describe("Analytics Controller", () => {
//     let req: Partial<Request>;
//     let res: Partial<Response>;

//     beforeEach(() => {
//         req = {};
//         res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn(),
//         };
//     });

//     describe("getTicketsPerMunicipality", () => {
//         test("should return 400 if municipality_id is missing", async () => {
//             req.query = {}; // No municipality_id

//             await analyticsController.getTicketsPerMunicipality(req as Request, res as Response);

//             expect(res.status).toHaveBeenCalledWith(400);
//             expect(res.json).toHaveBeenCalledWith({ Error: "Missing parameter: municipality_id" });
//         });

//         test("should return 200 and call service on success", async () => {
//             req.query = { municipality_id: "123" };
//             const mockResult = [{ ticket_id: 1, description: "test ticket" }];
//             (analyticsService.getTicketsPerMunicipality as jest.Mock).mockResolvedValue(mockResult);

//             await analyticsController.getTicketsPerMunicipality(req as Request, res as Response);

//             expect(res.status).toHaveBeenCalledWith(200);
//             expect(res.json).toHaveBeenCalledWith(mockResult);
//         });

//         test("should return 500 on internal server error", async () => {
//             req.query = { municipality_id: "123" };
//             const mockError = new Error("Internal server error");
//             (analyticsService.getTicketsPerMunicipality as jest.Mock).mockRejectedValue(mockError);

//             await analyticsController.getTicketsPerMunicipality(req as Request, res as Response);

//             expect(res.status).toHaveBeenCalledWith(500);
//             expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
//         });
//     });

//     describe("getContractsPerServiceProvider", () => {
//         test("should return 400 if service_provider is missing", async () => {
//             req.query = {}; // No service_provider

//             await analyticsController.getContractsPerServiceProvider(req as Request, res as Response);

//             expect(res.status).toHaveBeenCalledWith(400);
//             expect(res.json).toHaveBeenCalledWith({ Error: "Missing parameter: service_provider" });
//         });

//         test("should return 200 and call service on success", async () => {
//             req.query = { service_provider: "Test Provider" };
//             const mockResult = [{ contract_id: 1, description: "test contract" }];
//             (analyticsService.getContractsPerServiceProvider as jest.Mock).mockResolvedValue(mockResult);

//             await analyticsController.getContractsPerServiceProvider(req as Request, res as Response);

//             expect(res.status).toHaveBeenCalledWith(200);
//             expect(res.json).toHaveBeenCalledWith(mockResult);
//         });

//         test("should return 500 on internal server error", async () => {
//             req.query = { service_provider: "Test Provider" };
//             const mockError = new Error("Internal server error");
//             (analyticsService.getContractsPerServiceProvider as jest.Mock).mockRejectedValue(mockError);

//             await analyticsController.getContractsPerServiceProvider(req as Request, res as Response);

//             expect(res.status).toHaveBeenCalledWith(500);
//             expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
//         });
//     });

//     describe("getTendersPerServiceProvider", () => {
//         test("should return 400 if service_provider is missing", async () => {
//             req.query = {}; // No service_provider

//             await analyticsController.getTendersPerServiceProvider(req as Request, res as Response);

//             expect(res.status).toHaveBeenCalledWith(400);
//             expect(res.json).toHaveBeenCalledWith({ Error: "Missing parameter: service_provider" });
//         });

//         test("should return 200 and call service on success", async () => {
//             req.query = { service_provider: "Test Provider" };
//             const mockResult = [{ tender_id: 1, description: "test tender" }];
//             (analyticsService.getTendersPerServiceProvider as jest.Mock).mockResolvedValue(mockResult);

//             await analyticsController.getTendersPerServiceProvider(req as Request, res as Response);

//             expect(res.status).toHaveBeenCalledWith(200);
//             expect(res.json).toHaveBeenCalledWith(mockResult);
//         });

//         test("should return 500 on internal server error", async () => {
//             req.query = { service_provider: "Test Provider" };
//             const mockError = new Error("Internal server error");
//             (analyticsService.getTendersPerServiceProvider as jest.Mock).mockRejectedValue(mockError);

//             await analyticsController.getTendersPerServiceProvider(req as Request, res as Response);

//             expect(res.status).toHaveBeenCalledWith(500);
//             expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
//         });
//     });
// });
