import request from "supertest";
import { app } from "../../app";
import * as analyticsService from "../../src/services/analytics.service";

jest.mock("../../src/services/analytics.service");

describe("Integration Test - /analytics", () => {

    describe("GET /tickets_per_municipality", () => {
        test("should return the number of tickets per municipality", async () => {
            const mockResponse = [
                { municipality_id: "uMshwathi", tickets: 10 },
                { municipality_id: "uMhlathuze", tickets: 20 },
                { municipality_id: "uMngeni", tickets: 30 },
            ];
            jest.spyOn(analyticsService, "getTicketsPerMunicipality").mockResolvedValue(mockResponse);

            const response = await request(app)
                .get("/analytics/tickets_per_municipality")
                .query({ municipality_id: "uMshwathi" }); // Use a valid municipality_id

            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body).toEqual(mockResponse);
            expect(Array.isArray(response.body)).toBe(true); // Assuming it returns an array
        });

        test("should return 400 if municipality_id is missing", async () => {
            const mockResponse = [
                { municipality_id: "uMshwathi", tickets: 10 },
                { municipality_id: "uMhlathuze", tickets: 20 },
                { municipality_id: "uMngeni", tickets: 30 },
            ];
            jest.spyOn(analyticsService, "getTicketsPerMunicipality").mockResolvedValue(mockResponse);

            const response = await request(app)
                .get("/analytics/tickets_per_municipality");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ Error: "Missing parameter: municipality_id" });
        });

    });

    describe("GET /contracts_per_service_provider", () => {
        test("should return contracts per service provider", async () => {
            const mockResponse = [
                { service_provider: "CityLink Maintenance", contracts: 10 },
                { service_provider: "CityLink Maintenance", contracts: 20 },
                { service_provider: "CityLink Maintenance", contracts: 30 },
            ];
            jest.spyOn(analyticsService, "getContractsPerServiceProvider").mockResolvedValue(mockResponse);

            const response = await request(app)
                .get("/analytics/contracts_per_service_provider")
                .query({ service_provider: "CityLink Maintenance" }); // Use a valid service_provider

            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body).toEqual(mockResponse);
            expect(Array.isArray(response.body)).toBe(true); // Assuming it returns an array
        });

        test("should return 400 if service_provider is missing", async () => {
            const mockResponse = [
                { service_provider: "CityLink Maintenance", contracts: 10 },
                { service_provider: "CityLink Maintenance", contracts: 20 },
                { service_provider: "CityLink Maintenance", contracts: 30 },
            ];
            jest.spyOn(analyticsService, "getContractsPerServiceProvider").mockResolvedValue(mockResponse);

            const response = await request(app)
                .get("/analytics/contracts_per_service_provider");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ Error: "Missing parameter: service_provider" });
        });

    });

    describe("GET /tenders_per_service_provider", () => {
        test("should return tenders per service provider", async () => {
            const mockResponse = [
                { service_provider: "CityLink Maintenance", tenders: 10 },
                { service_provider: "CityLink Maintenance", tenders: 20 },
                { service_provider: "CityLink Maintenance", tenders: 30 },
            ];
            jest.spyOn(analyticsService, "getTendersPerServiceProvider").mockResolvedValue(mockResponse);
            
            const response = await request(app)
                .get("/analytics/tenders_per_service_provider")
                .query({ service_provider: "CityLink Maintenance" }); // Use a valid service_provider

            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body).toEqual(mockResponse);
            expect(Array.isArray(response.body)).toBe(true); // Assuming it returns an array
        });

        test("should return 400 if service_provider is missing", async () => {
            const mockResponse = [
                { service_provider: "CityLink Maintenance", tenders: 10 },
                { service_provider: "CityLink Maintenance", tenders: 20 },
                { service_provider: "CityLink Maintenance", tenders: 30 },
            ];
            jest.spyOn(analyticsService, "getTendersPerServiceProvider").mockResolvedValue(mockResponse);
            
            const response = await request(app)
                .get("/analytics/tenders_per_service_provider");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ Error: "Missing parameter: service_provider" });
        });
    });

});
