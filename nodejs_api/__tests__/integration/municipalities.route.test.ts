import request from "supertest";
import { app } from "../../app";
import * as municipalitiesService from "../../src/services/municipalities.service";

jest.mock("../../src/services/municipalities.service");

describe("Integration Test - /municipalities", () => {
    
    describe("GET /municipalities-list", () => {
        test("should return a list of municipalities", async () => {
            const mockResponse = [
                { municipality_id: "municipality1" },
                { municipality_id: "municipality2" },
                { municipality_id: "municipality3" },
            ];
            jest.spyOn(municipalitiesService, "getAllMunicipalities").mockResolvedValue(mockResponse);
            
            const response = await request(app).get("/municipality/municipalities-list");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockResponse);
            expect(municipalitiesService.getAllMunicipalities).toHaveBeenCalledTimes(1);
        });
    });

    describe("GET /coordinates", () => {
        test("should return the coordinates of municipalities", async () => {
            const mockResponse = { latitude: 1.234, longitude: 5.678 };
            jest.spyOn(municipalitiesService, "getMunicipalityCoordinates").mockResolvedValue(mockResponse);

            const response = await request(app).get("/municipality/coordinates?municipality=municipality1");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockResponse);
            expect(municipalitiesService.getMunicipalityCoordinates).toHaveBeenCalledTimes(1);
        });
    });

});
