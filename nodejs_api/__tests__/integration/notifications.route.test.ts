import request from "supertest";
import { app } from "../../app"; // Adjust the path as necessary to import your Express app

describe("Integration Test - /notifications", () => {

    describe("POST /insert-tokens", () => {
        test("should insert notification tokens", async () => {
        });
    });

    describe("GET /get-tokens", () => {
        test("should return a list of notification tokens", async () => {
            const response = await request(app).get("/notifications/get-tokens");
        });
    });

});
