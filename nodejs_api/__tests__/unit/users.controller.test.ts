import { Request, Response } from "express";
import * as usersController from "../../src/controllers/users.controller";
import * as usersService from "../../src/services/users.service";

// Mock the users service
jest.mock("../../src/services/users.service");

// Define the mock File type
interface MockFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
    stream: any; // Assuming this can be of any type for the mock
    destination: string;
    filename: string;
    path: string;
}

describe("Users Controller", () => {
    const req: Partial<Request> = {}; // Partial mock request
    const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    }; // Partial mock response

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("uploadProfilePicture", () => {
        it("should return 400 if username or file is missing", async () => {
            req.body = { username: "testUser" }; // Missing file

            await usersController.uploadProfilePicture(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ Error: "Missing parameter: username and/or file" });
        });

        it("should return 400 if username is missing", async () => {
            req.file = {
                fieldname: "file",
                originalname: "profile-pic.jpg",
                encoding: "7bit",
                mimetype: "image/jpeg",
                buffer: Buffer.from("mock file content"), // Simulate the file content
                size: 1024,
                stream: null, // Mock value
                destination: "/uploads", // Mock value
                filename: "profile-pic.jpg", // Mock value
                path: "/uploads/profile-pic.jpg", // Mock value
            } as MockFile; // Use a valid mock file
            req.body = {}; // Missing username

            await usersController.uploadProfilePicture(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ Error: "Missing parameter: username and/or file" });
        });

        it("should return 200 and the response on success", async () => {
            req.body = { username: "testUser" };
            req.file = {
                fieldname: "file",
                originalname: "profile-pic.jpg",
                encoding: "7bit",
                mimetype: "image/jpeg",
                buffer: Buffer.from("mock file content"), // Simulate the file content
                size: 1024,
                stream: null, // Mock value
                destination: "/uploads", // Mock value
                filename: "profile-pic.jpg", // Mock value
                path: "/uploads/profile-pic.jpg", // Mock value
            } as MockFile; // Mock file with required properties
            
            const mockResponse = { success: true, message: "Profile picture uploaded successfully" };
            (usersService.uploadProfilePicture as jest.Mock).mockResolvedValue(mockResponse);

            await usersController.uploadProfilePicture(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });

        it("should return 500 on internal server error", async () => {
            req.body = { username: "testUser" };
            req.file = {
                fieldname: "file",
                originalname: "profile-pic.jpg",
                encoding: "7bit",
                mimetype: "image/jpeg",
                buffer: Buffer.from("mock file content"), // Simulate the file content
                size: 1024,
                stream: null, // Mock value
                destination: "/uploads", // Mock value
                filename: "profile-pic.jpg", // Mock value
                path: "/uploads/profile-pic.jpg", // Mock value
            } as MockFile; // Mock file with required properties
            
            const mockError = new Error("Internal server error");
            (usersService.uploadProfilePicture as jest.Mock).mockRejectedValue(mockError);

            await usersController.uploadProfilePicture(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: mockError.message });
        });
    });
});
