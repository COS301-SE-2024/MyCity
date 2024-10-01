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
        test("should create a ticket successfully", async () => {
            const mockResponse = {
                message: "Ticket created successfully",
                ticket_id: "ticket123",
                watchlist_id: "watchlist123",
            };

            jest.spyOn(ticketsService, "createTicket").mockResolvedValue(mockResponse);

            const formData = {
                username: "john_doe",
                address: "123 Main St",
                asset: "asset123",
                description: "Leaking pipe on the street",
                latitude: "37.7749",
                longitude: "-122.4194",
                state: "Open",
            };

            const response = await request(app)
                .post("/tickets/create")
                .send(formData);

            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual(mockResponse);

            expect(ticketsService.createTicket).toHaveBeenCalledWith(formData, undefined); // No file was uploaded in this case
        });

        test("should return 400 if any required fields are missing", async () => {
            const incompleteFormData = {
                username: "john_doe",
                address: "123 Main St",
            };

            const response = await request(app)
                .post("/tickets/create")
                .send(incompleteFormData);

            expect(response.statusCode).toBe(400);

            expect(response.body.Error).toBe(
                "Missing parameter(s): asset, description, latitude, longitude, state"
            );
        });

        test("should return 500 if there is a service error", async () => {
            jest.spyOn(ticketsService, "createTicket").mockRejectedValue(new Error("Internal Server Error"));

            const validFormData = {
                username: "john_doe",
                address: "123 Main St",
                asset: "asset123",
                description: "Leaking pipe on the street",
                latitude: "37.7749",
                longitude: "-122.4194",
                state: "Open",
            };

            const response = await request(app)
                .post("/tickets/create")
                .send(validFormData);

            expect(response.statusCode).toBe(500);

            expect(response.body).toEqual({ Error: "Internal Server Error" });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe("POST /tickets/addwatchlist", () => {
        test("should add a ticket to watchlist successfully", async () => {
            const mockResponse = {
                Status: "Success",
                Message: "Ticket has been added to john_doe with id of: watchlist123",
            };

            jest.spyOn(ticketsService, "addWatchlist").mockResolvedValue(mockResponse);

            const formData = {
                username: "john_doe",
                ticket_id: "ticket123",
            };

            const response = await request(app)
                .post("/tickets/addwatchlist")
                .send(formData);

            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual(mockResponse);

            expect(ticketsService.addWatchlist).toHaveBeenCalledWith(formData);
        });

        test("should return 400 if any required fields are missing", async () => {
            const incompleteFormData = {
                username: "john_doe",
            };

            const response = await request(app)
                .post("/tickets/addwatchlist")
                .send(incompleteFormData);

            expect(response.statusCode).toBe(400);

            expect(response.body.Error).toBe("Missing parameter(s): ticket_id");
        });

        test("should return error if ticket is already in the watchlist", async () => {
            const errorResponse = {
                Error: {
                    Code: "AlreadyExists",
                    Message: "Already have ticket in watchlist",
                },
            };
            jest.spyOn(ticketsService, "addWatchlist").mockRejectedValue(new Error("Already have ticket in watchlist"));

            const formData = {
                username: "john_doe",
                ticket_id: "ticket123",
            };

            const response = await request(app)
                .post("/tickets/addwatchlist")
                .send(formData);

            expect(response.statusCode).toBe(500);

            expect(response.body).toEqual({ Error: "Already have ticket in watchlist" });
        });

        test("should return error if ticket does not exist", async () => {
            jest.spyOn(ticketsService, "addWatchlist").mockRejectedValue(new Error("Ticket doesn't exist"));

            const formData = {
                username: "john_doe",
                ticket_id: "nonexistent_ticket",
            };

            const response = await request(app)
                .post("/tickets/addwatchlist")
                .send(formData);

            expect(response.statusCode).toBe(500);

            expect(response.body).toEqual({ Error: "Ticket doesn't exist" });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe("POST /tickets/accept", () => {
        test("should accept a ticket successfully", async () => {
            const mockResponse = {
                Status: "Success",
                Ticket_id: "ticket123",
            };

            jest.spyOn(ticketsService, "acceptTicket").mockResolvedValue(mockResponse);

            const formData = {
                ticket_id: "ticket123",
            };

            const response = await request(app)
                .post("/tickets/accept")
                .send(formData);

            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual(mockResponse);

            expect(ticketsService.acceptTicket).toHaveBeenCalledWith(formData);
        });

        test("should return 400 if required fields are missing", async () => {
            const incompleteFormData = {
                // ticket_id is missing
            };

            const response = await request(app)
                .post("/tickets/accept")
                .send(incompleteFormData);

            expect(response.statusCode).toBe(400);

            expect(response.body.Error).toBe("Missing parameter(s): ticket_id");
        });

        test("should return error if ticket does not exist", async () => {
            jest.spyOn(ticketsService, "acceptTicket").mockRejectedValue(new Error("Ticket doesn't exist"));

            const formData = {
                ticket_id: "nonexistent_ticket",
            };

            const response = await request(app)
                .post("/tickets/accept")
                .send(formData);

            expect(response.statusCode).toBe(500);

            expect(response.body).toEqual({ Error: "Ticket doesn't exist" });
        });

        test("should return error if there is an issue updating the ticket state", async () => {
            jest.spyOn(ticketsService, "acceptTicket").mockRejectedValue(new Error("Error occurred while trying to update"));

            const formData = {
                ticket_id: "ticket123",
            };

            const response = await request(app)
                .post("/tickets/accept")
                .send(formData);

            expect(response.statusCode).toBe(500);

            expect(response.body).toEqual({ Error: "Error occurred while trying to update" });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe("POST /tickets/close", () => {
        describe("POST /tickets/close", () => {
            test("should close a ticket successfully", async () => {
                const mockResponse = {
                    Status: "Success",
                    Ticket_id: "ticket123",
                };

                jest.spyOn(ticketsService, "closeTicket").mockResolvedValue(mockResponse);

                const formData = {
                    ticket_id: "ticket123",
                };

                const response = await request(app)
                    .post("/tickets/close")
                    .send(formData);

                expect(response.statusCode).toBe(200);

                expect(response.body).toEqual(mockResponse);

                expect(ticketsService.closeTicket).toHaveBeenCalledWith(formData);
            });

            test("should return 400 if required fields are missing", async () => {
                const incompleteFormData = {
                    // ticket_id is missing
                };

                const response = await request(app)
                    .post("/tickets/close")
                    .send(incompleteFormData);

                expect(response.statusCode).toBe(400);

                expect(response.body.Error).toBe("Missing parameter(s): ticket_id");
            });

            test("should return error if ticket does not exist", async () => {
                jest.spyOn(ticketsService, "closeTicket").mockRejectedValue(new Error("Ticket doesn't exist"));

                const formData = {
                    ticket_id: "nonexistent_ticket",
                };

                const response = await request(app)
                    .post("/tickets/close")
                    .send(formData);

                expect(response.statusCode).toBe(500);

                expect(response.body).toEqual({ Error: "Ticket doesn't exist" });
            });

            test("should return error if there is an issue updating the ticket state", async () => {
                jest.spyOn(ticketsService, "closeTicket").mockRejectedValue(new Error("Error occurred while trying to update"));

                const formData = {
                    ticket_id: "ticket123",
                };

                const response = await request(app)
                    .post("/tickets/close")
                    .send(formData);

                expect(response.statusCode).toBe(500);

                expect(response.body).toEqual({ Error: "Error occurred while trying to update" });
            });

            afterEach(() => {
                jest.restoreAllMocks();
            });
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
                .query({ ticket_id: "123" });

            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual(mockTicketData);

            expect(ticketsService.viewTicketData).toHaveBeenCalledWith("123");
        });

        test("should return 400 if the ticket_id is missing", async () => {
            const response = await request(app).get("/tickets/view");

            expect(response.statusCode).toBe(400);

            expect(response.body).toEqual({ Error: "Missing parameter: ticket_id" });
        });

        test("should return 500 if there is a service error", async () => {
            jest.spyOn(ticketsService, "viewTicketData").mockRejectedValue(new Error("Internal Server Error"));

            const response = await request(app)
                .get("/tickets/view")
                .query({ ticket_id: "123" });

            expect(response.statusCode).toBe(500);

            expect(response.body).toEqual({ Error: "Internal Server Error" });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe("GET /tickets/getmytickets", () => {
        test("should return my tickets successfully", async () => {
            const mockResponse = [
                { ticket_id: "ticket123", username: "john_doe", state: "Open" },
                { ticket_id: "ticket456", username: "john_doe", state: "Closed" },
            ];

            jest.spyOn(ticketsService, "getMyTickets").mockResolvedValue(mockResponse);

            const response = await request(app)
                .get("/tickets/getmytickets")
                .query({ username: "john_doe" });

            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual(mockResponse);

            expect(ticketsService.getMyTickets).toHaveBeenCalledWith("john_doe");
        });

        test("should return 400 if username is missing", async () => {
            const response = await request(app)
                .get("/tickets/getmytickets")
                .query({});

            expect(response.statusCode).toBe(400);

            expect(response.body.Error).toBe("Missing parameter: username");
        });

        test("should return error if no tickets are found", async () => {
            jest.spyOn(ticketsService, "getMyTickets").mockRejectedValue(new Error("Doesn't have ticket"));

            const response = await request(app)
                .get("/tickets/getmytickets")
                .query({ username: "nonexistent_user" });

            expect(response.statusCode).toBe(500);

            expect(response.body).toEqual({ Error: "Doesn't have ticket" });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe("GET /tickets/getinarea", () => {
        test("should get tickets within a given municipality", async () => {
            const mockResponse = {
                lastEvaluatedKey: {
                    ticket_id: "ticket123",
                    municipality_id: "municipality_1",
                    state: "Opened"
                },
                items: [
                    { ticket_id: "ticket123", municipality_id: "municipality_1", state: "Open" },
                    { ticket_id: "ticket456", municipality_id: "municipality_1", state: "Closed" },
                ]
            };

            jest.spyOn(ticketsService, "getInMyMunicipality").mockResolvedValue(mockResponse);

            const response = await request(app)
                .get("/tickets/getinarea")
                .query({ municipality: "municipality_1" });

            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual(mockResponse);

            expect(ticketsService.getInMyMunicipality).toHaveBeenCalledWith("municipality_1");
        });

        test("should return 400 if municipality is missing", async () => {
            const response = await request(app)
                .get("/tickets/getinarea")
                .query({});

            expect(response.statusCode).toBe(400);

            expect(response.body.Error).toBe("Missing parameter: municipality");
        });

        test("should return error if no tickets are found in the municipality", async () => {
            jest.spyOn(ticketsService, "getInMyMunicipality").mockRejectedValue(new Error("Doesn't have a ticket in municipality"));

            const response = await request(app)
                .get("/tickets/getinarea")
                .query({ municipality: "municipality_2" });

            expect(response.statusCode).toBe(500);

            expect(response.body).toEqual({ Error: "Doesn't have a ticket in municipality" });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe("GET /tickets/getopeninarea", () => {
        test("should get open tickets in a municipality", async () => {
            const mockResponse = [
                { ticket_id: "ticket123", municipality_id: "municipality_1", state: "Opened" },
                { ticket_id: "ticket456", municipality_id: "municipality_1", state: "Opened" },
            ];

            jest.spyOn(ticketsService, "getOpenTicketsInMunicipality").mockResolvedValue(mockResponse);

            const response = await request(app)
                .get("/tickets/getopeninarea")
                .query({ municipality: "municipality_1" });

            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual(mockResponse);

            expect(ticketsService.getOpenTicketsInMunicipality).toHaveBeenCalledWith("municipality_1");
        });

        test("should return 400 if municipality is missing", async () => {
            const response = await request(app)
                .get("/tickets/getopeninarea")
                .query({});

            expect(response.statusCode).toBe(400);

            expect(response.body.Error).toBe("Missing parameter: municipality");
        });

        test("should return error if no open tickets are found in the municipality", async () => {
            jest.spyOn(ticketsService, "getOpenTicketsInMunicipality").mockRejectedValue(new Error("Doesn't have open tickets in municipality"));

            const response = await request(app)
                .get("/tickets/getopeninarea")
                .query({ municipality: "municipality_2" });

            expect(response.statusCode).toBe(500);

            expect(response.body).toEqual({ Error: "Doesn't have open tickets in municipality" });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe("GET /tickets/getwatchlist", () => {
        test("should return watchlisted tickets", async () => {
            const mockResponse = {
                lastEvaluatedKey: {
                    ticket_id: "ticket123",
                    title: "Broken street light",
                    state: "Opened"
                },
                items: [
                    { ticket_id: "ticket123", title: "Broken street light", state: "Opened" },
                    { ticket_id: "ticket456", title: "Pothole repair", state: "Opened" },
                ]
            };

            jest.spyOn(ticketsService, "getWatchlist").mockResolvedValue(mockResponse);

            const response = await request(app)
                .get("/tickets/getwatchlist")
                .query({ username: "user_1" });

            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual(mockResponse);

            expect(ticketsService.getWatchlist).toHaveBeenCalledWith("user_1");
        });

        test("should return 400 if username is missing", async () => {
            const response = await request(app)
                .get("/tickets/getwatchlist")
                .query({});

            expect(response.statusCode).toBe(400);

            expect(response.body.Error).toBe("Missing parameter: username");
        });

        test("should return error if no tickets are found in the watchlist", async () => {
            jest.spyOn(ticketsService, "getWatchlist").mockRejectedValue(new Error("NoWatchlist: Doesn't have a watchlist"));

            const response = await request(app)
                .get("/tickets/getwatchlist")
                .query({ username: "user_2" });

            expect(response.statusCode).toBe(500);

            expect(response.body).toEqual({ Error: "NoWatchlist: Doesn't have a watchlist" });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe("POST /tickets/add-comment-with-image", () => {
        test("should add comment with image", async () => {
            const mockRequestBody = {
                comment: "This is a test comment.",
                ticket_id: "ticket123",
                image_url: "http://example.com/image.jpg",
                user_id: "user456"
            };

            const mockServiceResponse = {
                message: "Comment added successfully",
                ticketupdate_id: "update789"
            };

            jest.spyOn(ticketsService, "addTicketCommentWithImage").mockResolvedValue(mockServiceResponse);

            const response = await request(app)
                .post("/tickets/add-comment-with-image")
                .send(mockRequestBody);

            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual(mockServiceResponse);

            expect(ticketsService.addTicketCommentWithImage).toHaveBeenCalledWith(
                mockRequestBody.comment,
                mockRequestBody.ticket_id,
                mockRequestBody.image_url,
                mockRequestBody.user_id
            );
        });

        test("should return 400 if required fields are missing", async () => {
            const mockRequestBody = {
                ticket_id: "ticket123",
                image_url: "http://example.com/image.jpg",
                user_id: "user456"
            };

            const response = await request(app)
                .post("/tickets/add-comment-with-image")
                .send(mockRequestBody);

            expect(response.statusCode).toBe(400);

            expect(response.body.error).toBe("Missing parameter(s): comment");
        });

        test("should return 500 if there is an internal server error", async () => {
            const mockRequestBody = {
                comment: "This is a test comment.",
                ticket_id: "ticket123",
                image_url: "http://example.com/image.jpg",
                user_id: "user456"
            };

            jest.spyOn(ticketsService, "addTicketCommentWithImage").mockRejectedValue(new Error("Internal Server Error"));

            const response = await request(app)
                .post("/tickets/add-comment-with-image")
                .send(mockRequestBody);

            expect(response.statusCode).toBe(500);

            expect(response.body.Error).toBe("Internal Server Error");
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe("POST /tickets/add-comment-without-image", () => {
        test("should add comment without image", async () => {
            const mockRequestBody = {
                comment: "This is a test comment without an image.",
                ticket_id: "ticket123",
                user_id: "user456"
            };

            const mockServiceResponse = {
                message: "Comment added successfully",
                ticketupdate_id: "update789"
            };

            jest.spyOn(ticketsService, "addTicketCommentWithoutImage").mockResolvedValue(mockServiceResponse);

            const response = await request(app)
                .post("/tickets/add-comment-without-image")
                .send(mockRequestBody);

            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual(mockServiceResponse);

            expect(ticketsService.addTicketCommentWithoutImage).toHaveBeenCalledWith(
                mockRequestBody.comment,
                mockRequestBody.ticket_id,
                mockRequestBody.user_id
            );
        });

        test("should return 400 if required fields are missing", async () => {
            const mockRequestBody = {
                ticket_id: "ticket123",
                user_id: "user456"
            };

            const response = await request(app)
                .post("/tickets/add-comment-without-image")
                .send(mockRequestBody);

            expect(response.statusCode).toBe(400);

            expect(response.body.error).toBe("Missing parameter(s): comment");
        });

        test("should return 500 if there is an internal server error", async () => {
            const mockRequestBody = {
                comment: "This is a test comment without an image.",
                ticket_id: "ticket123",
                user_id: "user456"
            };

            jest.spyOn(ticketsService, "addTicketCommentWithoutImage").mockRejectedValue(new Error("Internal Server Error"));

            const response = await request(app)
                .post("/tickets/add-comment-without-image")
                .send(mockRequestBody);

            expect(response.statusCode).toBe(500);

            expect(response.body.Error).toBe("Internal Server Error");
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });
});
