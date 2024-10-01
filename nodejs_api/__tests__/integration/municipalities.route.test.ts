import request from "supertest";
import { app } from "../../app"; // Adjust the path as necessary to import your Express app

describe("Integration Test - /municipalities", () => {
    
    describe("GET /municipalities-list", () => {
        test("should return a list of municipalities", async () => {
            const response = await request(app).get("/municipalities/municipalities-list");
        });
    });

    describe("GET /coordinates", () => {
        test("should return the coordinates of municipalities", async () => {
            const response = await request(app).get("/municipalities/coordinates");
        });
    });

});
