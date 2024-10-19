import { Request, Response } from "express";
import * as searchingController from "../../src/controllers/searching.controller";
import * as searchingService from "../../src/services/searching.service";

// Mock the services
jest.mock("../../src/services/searching.service");

describe("Searching Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeAll(() => {
        // Reset mocks before each test
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnThis(); // Allows chaining `.json`
        req = {};
        res = {
            json: jsonMock,
            status: statusMock,
        };
        jest.clearAllMocks();
    });

    describe("searchTickets", () => {
        beforeEach(() => {
            req.originalUrl = "/search/issues";
        });

        it("should return 400 if q or user_municipality are missing", async () => {
            req = { query: {}, body: {} };
            await searchingController.searchTickets(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                Error: "Missing parameter(s): q and/or user_municipality",
            });
        });

        it("should return 200 with the search results", async () => {
            const mockResult = [{ id: "ticket1" }];
            (searchingService.searchTickets as jest.Mock).mockResolvedValueOnce(mockResult);

            req = { query: { q: "search" }, body: { user_municipality: "municipality1" } };

            await searchingController.searchTickets(req as Request, res as Response);

            expect(searchingService.searchTickets).toHaveBeenCalledWith(
                "municipality1",
                "search"
            );
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockResult);
        });

        it("should return 500 if the service throws an error", async () => {
            const mockError = new Error("Something went wrong");
            (searchingService.searchTickets as jest.Mock).mockRejectedValueOnce(mockError);

            req = { query: { q: "search" }, body: { user_municipality: "municipality1" } };

            await searchingController.searchTickets(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });

    describe("searchMunicipalities", () => {
        beforeEach(() => {
            req.originalUrl = "/search/municipality";
        });


        it("should return 400 if q is missing", async () => {
            req = { query: {} };
            await searchingController.searchMunicipalities(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ Error: "Missing parameter: q" });
        });

        it("should return 200 with the search results", async () => {
            const mockResult = [{ name: "municipality1" }];
            (searchingService.searchMunicipalities as jest.Mock).mockResolvedValueOnce(mockResult);

            req = { query: { q: "search" } };

            await searchingController.searchMunicipalities(req as Request, res as Response);

            expect(searchingService.searchMunicipalities).toHaveBeenCalledWith("search");
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockResult);
        });

        it("should return 500 if the service throws an error", async () => {
            const mockError = new Error("Something went wrong");
            (searchingService.searchMunicipalities as jest.Mock).mockRejectedValueOnce(mockError);

            req = { query: { q: "search" } };

            await searchingController.searchMunicipalities(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });

    describe("searchMunicipalityTickets", () => {
        beforeEach(() => {
            req.originalUrl = "/search/municipality-tickets";
        });

        it("should return 400 if q is missing", async () => {
            req = { query: {} };
            await searchingController.searchMunicipalityTickets(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ Error: "Missing parameter: q" });
        });

        it("should return 200 with the search results", async () => {
            const mockResult = [{ id: "ticket1" }];
            (searchingService.searchAltMunicipalityTickets as jest.Mock).mockResolvedValueOnce(
                mockResult
            );

            req = { query: { q: "municipalityName" } };

            await searchingController.searchMunicipalityTickets(req as Request, res as Response);

            expect(searchingService.searchAltMunicipalityTickets).toHaveBeenCalledWith(
                "municipalityName"
            );
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockResult);
        });

        it("should return 500 if the service throws an error", async () => {
            const mockError = new Error("Something went wrong");
            (searchingService.searchAltMunicipalityTickets as jest.Mock).mockRejectedValueOnce(
                mockError
            );

            req = { query: { q: "municipalityName" } };

            await searchingController.searchMunicipalityTickets(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });

    describe("searchServiceProviders", () => {
        beforeEach(() => {
            req.originalUrl = "/search/service-provider";
        });

        it("should return 400 if q is missing", async () => {
            req = { query: {} };
            await searchingController.searchServiceProviders(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ Error: "Missing parameter: q" });
        });

        it("should return 200 with the search results", async () => {
            const mockResult = [{ id: "provider1" }];
            (searchingService.searchServiceProviders as jest.Mock).mockResolvedValueOnce(mockResult);

            req = { query: { q: "providerName" } };

            await searchingController.searchServiceProviders(req as Request, res as Response);

            expect(searchingService.searchServiceProviders).toHaveBeenCalledWith("providerName");
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockResult);
        });

        it("should return 500 if the service throws an error", async () => {
            const mockError = new Error("Something went wrong");
            (searchingService.searchServiceProviders as jest.Mock).mockRejectedValueOnce(mockError);

            req = { query: { q: "providerName" } };

            await searchingController.searchServiceProviders(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });
});
