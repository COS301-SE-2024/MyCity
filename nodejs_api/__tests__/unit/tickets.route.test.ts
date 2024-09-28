import request from "supertest";
import { app } from "../../app";

describe("Integration Test - /tickets/fault-types", () => {
    test("GET /tickets/fault-types should return fault types", async () => {
        const response = await request(app).get("/tickets/fault-types");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    asset_id: expect.anything(),
                    assetIcon: expect.anything(),
                    multiplier: expect.anything(),
                }),
            ]));
    });
});