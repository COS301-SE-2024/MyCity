import { Request, Response } from "express";
import * as municipalitiesController from "../../src/controllers/municipalities.controller";
import * as municipalitiesService from "../../src/services/municipalities.service";

jest.mock("../../src/services/municipalities.service");

describe("Municipalities Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeAll(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe("getAllMunicipalitiesList", () => {
        beforeEach(() => {
            req.originalUrl = "/municipality/municipalities-list";
        });

        test("should return 200 and the municipalities list on success", async () => {
            const mockResponse = [{ id: 1, name: "Municipality A" }, { id: 2, name: "Municipality B" }];
            (municipalitiesService.getAllMunicipalities as jest.Mock).mockResolvedValue(mockResponse);

            await municipalitiesController.getAllMunicipalitiesList(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });

        test("should return 500 on internal server error", async () => {
            const mockError = new Error("Internal server error");
            (municipalitiesService.getAllMunicipalities as jest.Mock).mockRejectedValue(mockError);

            await municipalitiesController.getAllMunicipalitiesList(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });

    describe("getMunicipalityCoordinates", () => {
        beforeEach(() => {
            req.originalUrl = "/municipality/coordinates";
        });

        test("should return 400 if municipality is missing", async () => {
            req.query = {}; // No municipality

            await municipalitiesController.getMunicipalityCoordinates(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ Error: "Missing parameter: municipality" });
        });

        test("should return 200 and coordinates on success", async () => {
            req.query = { municipality: "Municipality A" };
            const mockResponse = { latitude: -25.0, longitude: 30.0 };
            (municipalitiesService.getMunicipalityCoordinates as jest.Mock).mockResolvedValue(mockResponse);

            await municipalitiesController.getMunicipalityCoordinates(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });

        test("should return 500 on internal server error", async () => {
            req.query = { municipality: "Municipality A" };
            const mockError = new Error("Internal server error");
            (municipalitiesService.getMunicipalityCoordinates as jest.Mock).mockRejectedValue(mockError);

            await municipalitiesController.getMunicipalityCoordinates(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });
});
