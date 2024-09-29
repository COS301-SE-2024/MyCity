import * as ticketsService from "../../src/services/tickets.service";
import { dynamoDBDocumentClient } from "../../src/config/dynamodb.config";
import { uploadFile } from "../../src/config/s3bucket.config";
import WebSocket from "ws";

// Mocking dynamoDBDocumentClient and uploadFile
jest.mock("../../src/config/dynamodb.config");
jest.mock("../../src/config/s3bucket.config");
jest.mock("ws")

describe("tickets service - getFaultTypes", () => {
    test("should return a list of fault types", async () => {
        const assetsMock = [
            { asset_id: "1", assetIcon: "icon1.png", multiplier: 1 },
            { asset_id: "2", assetIcon: "icon2.png", multiplier: 2 },
        ];

        (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce({ Items: assetsMock });

        const faultTypes = await ticketsService.getFaultTypes();

        expect(faultTypes).toEqual([
            { asset_id: "1", assetIcon: "icon1.png", multiplier: 1 },
            { asset_id: "2", assetIcon: "icon2.png", multiplier: 2 },
        ]);
    });

    test("should return an empty array if no assets are found", async () => {
        (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce({ Items: [] });

        const faultTypes = await ticketsService.getFaultTypes();

        expect(faultTypes).toEqual([]);
    });
});



describe("tickets service - createTicket", () => {
    const mockFile = { originalname: "testImage.jpg" } as Express.Multer.File;
    const formData = {
        username: "testUser",
        asset: "asset123",
        latitude: "25.746",
        longitude: "28.187",
        description: "Test description",
        address: "123 Test St.",
        state: "Open",
    };

    beforeEach(() => {
        // Clear mock calls before each test
        jest.clearAllMocks();
    });

    test("should create a ticket successfully", async () => {
        (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce({
            Item: { asset_id: "asset123" }, // Mock GetCommand for asset existence
        });
        (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce({}); // Mock PutCommand for ticket creation
        (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce({}); // Mock PutCommand for watchlist
        (uploadFile as jest.Mock).mockResolvedValueOnce("https://example.com/testImage.jpg");

        const result = await ticketsService.createTicket(formData, mockFile);

        expect(result).toEqual(
            expect.objectContaining({
                message: "Ticket created successfully",
                ticket_id: expect.any(String),
                watchlist_id: expect.any(String),
            })
        );
        expect(uploadFile).toHaveBeenCalledWith("ticket_images", "testUser", mockFile);
        expect(dynamoDBDocumentClient.send).toHaveBeenCalledTimes(4); // Asset check, ticket creation, and watchlist addition
    });

    test("should throw an error if asset does not exist", async () => {
        (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce({}); // Mock empty response for asset check

        await expect(ticketsService.createTicket(formData, mockFile)).rejects.toThrow("NoItems");
    });
});