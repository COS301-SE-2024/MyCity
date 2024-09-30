import request from "supertest";
import { app } from "../../app";
import * as ticketsService from "../../src/services/tickets.service";

describe("Integration Tests - /tickets", () => {
    
    describe("GET /tickets/fault-types", () => {
        test("should return fault types", async () => {
            const response = await request(app).get("/tickets/fault-types");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        asset_id: expect.anything(),
                        assetIcon: expect.anything(),
                        multiplier: expect.anything(),
                    }),
                ])
            );
        });
    });

    describe("POST /tickets/create", () => {
        test("should create a ticket", async () => {
        });
    });

    describe("POST /tickets/addwatchlist", () => {
        test("should add a ticket to watchlist", async () => {

        });
    });

    describe("POST /tickets/accept", () => {
        test("should accept a ticket", async () => {

        });
    });

    describe("POST /tickets/close", () => {
        test("should close a ticket", async () => {

        });
    });

    describe("GET /tickets/view", () => {
        test("should return 200 and ticket data if the ticket exists", async () => {
            const mockTicketData = [
                {
                    ticket_id: "123",
                    title: "Leaking pipe",
                    description: "There's a major water leak on the corner of XYZ Street.",
                    status: "Open",
                }
            ];

            jest.spyOn(ticketsService, "viewTicketData").mockResolvedValue(mockTicketData);

            const response = await request(app)
                .get("/tickets/view")
                .query({ ticket_id: "123" }); // Simulate a request with a ticket ID

            // Assert that the response status is 200
            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual(mockTicketData);

            expect(ticketsService.viewTicketData).toHaveBeenCalledWith("123");
        });

        test("should return 400 if the ticket_id is missing", async () => {
            // Make the request without a ticket_id
            const response = await request(app).get("/tickets/view");

            // Assert that the response status is 400
            expect(response.statusCode).toBe(400);

            // Assert that the error message is correct
            expect(response.body).toEqual({ Error: "Missing parameter: ticket_id" });
        });

        test("should return 500 if there is a service error", async () => {
            // Mock the service to throw an error
            jest.spyOn(ticketsService, "viewTicketData").mockRejectedValue(new Error("Internal Server Error"));

            // Make the request with a valid ticket_id
            const response = await request(app)
                .get("/tickets/view")
                .query({ ticket_id: "123" });

            // Assert that the response status is 500
            expect(response.statusCode).toBe(500);

            // Assert that the error message is correct
            expect(response.body).toEqual({ Error: "Internal Server Error" });
        });

        afterEach(() => {
            // Restore the original implementation after each test
            jest.restoreAllMocks();
        });
    });

    describe("GET /tickets/getmytickets", () => {
        test("should return my tickets", async () => {

        });
    });

    describe("GET /tickets/getinarea", () => {
        test("should get tickets within a given municipality", async () => {

        });
    });

    describe("GET /tickets/getopeninarea", () => {
        test("should get open tickets in a municipality", async () => {

        });
    });

    describe("GET /tickets/getwatchlist", () => {
        test("should return watchlisted tickets", async () => {

        });
    });

    describe("GET /tickets/getUpvotes", () => {
        test("should return most upvoted tickets", async () => {

        });
    });

    describe("GET /tickets/getcompanytickets", () => {
        test("should return company tickets", async () => {

        });
    });

    describe("GET /tickets/getopencompanytickets", () => {
        test("should return open company tickets", async () => {

        });
    });

    describe("POST /tickets/add-comment-with-image", () => {
        test("should add comment with image", async () => {

        });
    });

    describe("POST /tickets/add-comment-without-image", () => {
        test("should add comment without image", async () => {

        });
    });

    describe("GET /tickets/comments", () => {
        test("should get ticket comments", async () => {

        });
    });

    describe("GET /tickets/geodata/all", () => {
        test("should get geodata of all tickets", async () => {

        });
    });
});
