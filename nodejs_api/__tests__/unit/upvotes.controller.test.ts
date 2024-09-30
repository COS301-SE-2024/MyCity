// import { Request, Response } from "express";
// import * as upvotesController from "../../src/controllers/upvotes.controller";
// import * as upvotesService from "../../src/services/upvotes.service";

// jest.mock("../../src/services/upvotes.service");

// describe("Upvotes Controller", () => {
//     let req: Partial<Request>;
//     let res: Partial<Response>;

//     beforeEach(() => {
//         req = {};
//         res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn(),
//         };
//     });

//     describe("searchUpvotes", () => {
//         it("should return 400 if the search term is missing", async () => {
//             req.query = {}; // No search term provided

//             await upvotesController.searchUpvotes(req as Request, res as Response);

//             expect(res.status).toHaveBeenCalledWith(400);
//             expect(res.json).toHaveBeenCalledWith({ Error: "Missing parameter: q" });
//         });

//         it("should return 200 and the search results on success", async () => {
//             req.query = { q: "testSearch" };
//             const mockResponse = [{ id: 1, content: "Upvote 1" }, { id: 2, content: "Upvote 2" }];
//             (upvotesService.searchUpvotes as jest.Mock).mockResolvedValue(mockResponse);

//             await upvotesController.searchUpvotes(req as Request, res as Response);

//             expect(res.status).toHaveBeenCalledWith(200);
//             expect(res.json).toHaveBeenCalledWith(mockResponse);
//         });

//         it("should return 500 on internal server error", async () => {
//             req.query = { q: "testSearch" };
//             const mockError = new Error("Internal server error");
//             (upvotesService.searchUpvotes as jest.Mock).mockRejectedValue(mockError);

//             await upvotesController.searchUpvotes(req as Request, res as Response);

//             expect(res.status).toHaveBeenCalledWith(500);
//             expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
//         });
//     });
// });
