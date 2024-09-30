import request from "supertest";
import { app } from "../../app"; 

describe("Integration Test - /analytics", () => {
    
    describe("GET /tickets_per_municipality", () => {
        test("should return the number of tickets per municipality", async () => {
            const response = await request(app)
                .get("/analytics/tickets_per_municipality")
                .query({ municipality_id: "uMshwathi" }); // Use a valid municipality_id
            
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(Array.isArray(response.body)).toBe(true); // Assuming it returns an array
        });

        test("should return 400 if municipality_id is missing", async () => {
            const response = await request(app)
                .get("/analytics/tickets_per_municipality");
            
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ Error: "Missing parameter: municipality_id" });
        });

    });

    describe("GET /contracts_per_service_provider", () => {
        test("should return contracts per service provider", async () => {
            const response = await request(app)
                .get("/analytics/contracts_per_service_provider")
                .query({ service_provider: "CityLink Maintenance" }); // Use a valid service_provider
            
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(Array.isArray(response.body)).toBe(true); // Assuming it returns an array
        });

        test("should return 400 if service_provider is missing", async () => {
            const response = await request(app)
                .get("/analytics/contracts_per_service_provider");
            
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ Error: "Missing parameter: service_provider" });
        });

    });

    describe("GET /tenders_per_service_provider", () => {
        test("should return tenders per service provider", async () => {
            const response = await request(app)
                .get("/analytics/tenders_per_service_provider")
                .query({ service_provider: "CityLink Maintenance" }); // Use a valid service_provider
            
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(Array.isArray(response.body)).toBe(true); // Assuming it returns an array
        });

        test("should return 400 if service_provider is missing", async () => {
            const response = await request(app)
                .get("/analytics/tenders_per_service_provider");
            
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ Error: "Missing parameter: service_provider" });
        });
    });

});
