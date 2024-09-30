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
            // Mock the service to return a successful ticket creation response
            const mockResponse = {
                message: "Ticket created successfully",
                ticket_id: "ticket123",
                watchlist_id: "watchlist123",
            };

            // Spy on the service method and mock its return value
            jest.spyOn(ticketsService, "createTicket").mockResolvedValue(mockResponse);

            // Sample form data for the ticket creation
            const formData = {
                username: "john_doe",
                address: "123 Main St",
                asset: "asset123",
                description: "Leaking pipe on the street",
                latitude: "37.7749",
                longitude: "-122.4194",
                state: "Open",
            };

            // Simulate a request with form data
            const response = await request(app)
                .post("/tickets/create")
                .send(formData); // In case a file is uploaded, use `.attach()`

            // Assert that the response status is 200
            expect(response.statusCode).toBe(200);

            // Assert that the response contains the correct data
            expect(response.body).toEqual(mockResponse);

            // Ensure the service method was called with the correct form data
            expect(ticketsService.createTicket).toHaveBeenCalledWith(formData, undefined); // No file was uploaded in this case
        });

        test("should return 400 if any required fields are missing", async () => {
            // Simulate a request with missing fields
            const incompleteFormData = {
                username: "john_doe",
                address: "123 Main St",
                // asset, description, latitude, longitude, state are missing
            };

            const response = await request(app)
                .post("/tickets/create")
                .send(incompleteFormData);

            // Assert that the response status is 400
            expect(response.statusCode).toBe(400);

            // Assert that the error message contains missing fields
            expect(response.body.Error).toBe(
                "Missing parameter(s): asset, description, latitude, longitude, state"
            );
        });

        test("should return 500 if there is a service error", async () => {
            // Mock the service to throw an error
            jest.spyOn(ticketsService, "createTicket").mockRejectedValue(new Error("Internal Server Error"));

            // Sample valid form data for ticket creation
            const validFormData = {
                username: "john_doe",
                address: "123 Main St",
                asset: "asset123",
                description: "Leaking pipe on the street",
                latitude: "37.7749",
                longitude: "-122.4194",
                state: "Open",
            };

            // Simulate a request with valid form data
            const response = await request(app)
                .post("/tickets/create")
                .send(validFormData);

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

    describe("POST /tickets/addwatchlist", () => {
        test("should add a ticket to watchlist successfully", async () => {
            // Mock the service to return a successful watchlist addition response
            const mockResponse = {
                Status: "Success",
                Message: "Ticket has been added to john_doe with id of: watchlist123",
            };

            // Spy on the service method and mock its return value
            jest.spyOn(ticketsService, "addWatchlist").mockResolvedValue(mockResponse);

            // Sample form data for adding to watchlist
            const formData = {
                username: "john_doe",
                ticket_id: "ticket123",
            };

            // Simulate a request with valid form data
            const response = await request(app)
                .post("/tickets/addwatchlist")
                .send(formData);

            // Assert that the response status is 200
            expect(response.statusCode).toBe(200);

            // Assert that the response contains the correct data
            expect(response.body).toEqual(mockResponse);

            // Ensure the service method was called with the correct form data
            expect(ticketsService.addWatchlist).toHaveBeenCalledWith(formData);
        });

        test("should return 400 if any required fields are missing", async () => {
            // Simulate a request with missing fields
            const incompleteFormData = {
                username: "john_doe",
                // ticket_id is missing
            };

            const response = await request(app)
                .post("/tickets/addwatchlist")
                .send(incompleteFormData);

            // Assert that the response status is 400
            expect(response.statusCode).toBe(400);

            // Assert that the error message contains missing fields
            expect(response.body.Error).toBe("Missing parameter(s): ticket_id");
        });

        test("should return error if ticket is already in the watchlist", async () => {
            // Mock the service to throw an error indicating that the ticket is already in the watchlist
            const errorResponse = {
                Error: {
                    Code: "AlreadyExists",
                    Message: "Already have ticket in watchlist",
                },
            };
            jest.spyOn(ticketsService, "addWatchlist").mockRejectedValue(new Error("Already have ticket in watchlist"));

            // Sample form data for adding to watchlist
            const formData = {
                username: "john_doe",
                ticket_id: "ticket123",
            };

            // Simulate a request with valid form data
            const response = await request(app)
                .post("/tickets/addwatchlist")
                .send(formData);

            // Assert that the response status is 500
            expect(response.statusCode).toBe(500);

            // Assert that the response contains the correct error message
            expect(response.body).toEqual({ Error: "Already have ticket in watchlist" });
        });

        test("should return error if ticket does not exist", async () => {
            // Mock the service to throw an error indicating that the ticket doesn't exist
            jest.spyOn(ticketsService, "addWatchlist").mockRejectedValue(new Error("Ticket doesn't exist"));

            // Sample form data for adding to watchlist
            const formData = {
                username: "john_doe",
                ticket_id: "nonexistent_ticket",
            };

            // Simulate a request with valid form data
            const response = await request(app)
                .post("/tickets/addwatchlist")
                .send(formData);

            // Assert that the response status is 500
            expect(response.statusCode).toBe(500);

            // Assert that the response contains the correct error message
            expect(response.body).toEqual({ Error: "Ticket doesn't exist" });
        });

        afterEach(() => {
            // Restore the original implementation after each test
            jest.restoreAllMocks();
        });
    });

    describe("POST /tickets/accept", () => {
        test("should accept a ticket successfully", async () => {
            // Mock the service to return a successful ticket acceptance response
            const mockResponse = {
                Status: "Success",
                Ticket_id: "ticket123",
            };

            // Spy on the service method and mock its return value
            jest.spyOn(ticketsService, "acceptTicket").mockResolvedValue(mockResponse);

            // Sample form data for accepting a ticket
            const formData = {
                ticket_id: "ticket123",
            };

            // Simulate a request with valid form data
            const response = await request(app)
                .post("/tickets/accept")
                .send(formData);

            // Assert that the response status is 200
            expect(response.statusCode).toBe(200);

            // Assert that the response contains the correct data
            expect(response.body).toEqual(mockResponse);

            // Ensure the service method was called with the correct form data
            expect(ticketsService.acceptTicket).toHaveBeenCalledWith(formData);
        });

        test("should return 400 if required fields are missing", async () => {
            // Simulate a request with missing fields
            const incompleteFormData = {
                // ticket_id is missing
            };

            const response = await request(app)
                .post("/tickets/accept")
                .send(incompleteFormData);

            // Assert that the response status is 400
            expect(response.statusCode).toBe(400);

            // Assert that the error message contains missing fields
            expect(response.body.Error).toBe("Missing parameter(s): ticket_id");
        });

        test("should return error if ticket does not exist", async () => {
            // Mock the service to throw an error indicating the ticket doesn't exist
            jest.spyOn(ticketsService, "acceptTicket").mockRejectedValue(new Error("Ticket doesn't exist"));

            // Sample form data for accepting a ticket
            const formData = {
                ticket_id: "nonexistent_ticket",
            };

            // Simulate a request with valid form data
            const response = await request(app)
                .post("/tickets/accept")
                .send(formData);

            // Assert that the response status is 500
            expect(response.statusCode).toBe(500);

            // Assert that the response contains the correct error message
            expect(response.body).toEqual({ Error: "Ticket doesn't exist" });
        });

        test("should return error if there is an issue updating the ticket state", async () => {
            // Mock the service to throw an error indicating there was an update issue
            jest.spyOn(ticketsService, "acceptTicket").mockRejectedValue(new Error("Error occurred while trying to update"));

            // Sample form data for accepting a ticket
            const formData = {
                ticket_id: "ticket123",
            };

            // Simulate a request with valid form data
            const response = await request(app)
                .post("/tickets/accept")
                .send(formData);

            // Assert that the response status is 500
            expect(response.statusCode).toBe(500);

            // Assert that the response contains the correct error message
            expect(response.body).toEqual({ Error: "Error occurred while trying to update" });
        });

        afterEach(() => {
            // Restore the original implementation after each test
            jest.restoreAllMocks();
        });
    });

    describe("POST /tickets/close", () => {
        describe("POST /tickets/close", () => {
            test("should close a ticket successfully", async () => {
                // Mock the service to return a successful ticket close response
                const mockResponse = {
                    Status: "Success",
                    Ticket_id: "ticket123",
                };
    
                // Spy on the service method and mock its return value
                jest.spyOn(ticketsService, "closeTicket").mockResolvedValue(mockResponse);
    
                // Sample form data for closing a ticket
                const formData = {
                    ticket_id: "ticket123",
                };
    
                // Simulate a request with valid form data
                const response = await request(app)
                    .post("/tickets/close")
                    .send(formData);
    
                // Assert that the response status is 200
                expect(response.statusCode).toBe(200);
    
                // Assert that the response contains the correct data
                expect(response.body).toEqual(mockResponse);
    
                // Ensure the service method was called with the correct form data
                expect(ticketsService.closeTicket).toHaveBeenCalledWith(formData);
            });
    
            test("should return 400 if required fields are missing", async () => {
                // Simulate a request with missing fields
                const incompleteFormData = {
                    // ticket_id is missing
                };
    
                const response = await request(app)
                    .post("/tickets/close")
                    .send(incompleteFormData);
    
                // Assert that the response status is 400
                expect(response.statusCode).toBe(400);
    
                // Assert that the error message contains missing fields
                expect(response.body.Error).toBe("Missing parameter(s): ticket_id");
            });
    
            test("should return error if ticket does not exist", async () => {
                // Mock the service to throw an error indicating the ticket doesn't exist
                jest.spyOn(ticketsService, "closeTicket").mockRejectedValue(new Error("Ticket doesn't exist"));
    
                // Sample form data for closing a ticket
                const formData = {
                    ticket_id: "nonexistent_ticket",
                };
    
                // Simulate a request with valid form data
                const response = await request(app)
                    .post("/tickets/close")
                    .send(formData);
    
                // Assert that the response status is 500
                expect(response.statusCode).toBe(500);
    
                // Assert that the response contains the correct error message
                expect(response.body).toEqual({ Error: "Ticket doesn't exist" });
            });
    
            test("should return error if there is an issue updating the ticket state", async () => {
                // Mock the service to throw an error indicating there was an update issue
                jest.spyOn(ticketsService, "closeTicket").mockRejectedValue(new Error("Error occurred while trying to update"));
    
                // Sample form data for closing a ticket
                const formData = {
                    ticket_id: "ticket123",
                };
    
                // Simulate a request with valid form data
                const response = await request(app)
                    .post("/tickets/close")
                    .send(formData);
    
                // Assert that the response status is 500
                expect(response.statusCode).toBe(500);
    
                // Assert that the response contains the correct error message
                expect(response.body).toEqual({ Error: "Error occurred while trying to update" });
            });
    
            afterEach(() => {
                // Restore the original implementation after each test
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
