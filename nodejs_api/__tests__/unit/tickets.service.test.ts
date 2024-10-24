import * as ticketsService from "../../src/services/tickets.service";
import { uploadFile } from "../../src/config/s3bucket.config";
import { addJobToReadQueue, addJobToWriteQueue } from "../../src/services/jobs.service";

// Mocking dynamoDBDocumentClient and uploadFile
jest.mock("../../src/config/s3bucket.config", () => ({
    uploadFile: jest.fn()
}));

jest.mock("../../src/utils/tenders.utils", () => ({
    sendWebSocketMessage: jest.fn(),
}));

describe("tickets service - getFaultTypes", () => {
    test("should return a list of fault types", async () => {
        const assetsMock = [
            { asset_id: "1", assetIcon: "icon1.png", multiplier: 1 },
            { asset_id: "2", assetIcon: "icon2.png", multiplier: 2 },
        ];

        (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue({ Items: assetsMock }) });

        const faultTypes = await ticketsService.getFaultTypes();

        expect(faultTypes).toEqual([
            { asset_id: "1", assetIcon: "icon1.png", multiplier: 1 },
            { asset_id: "2", assetIcon: "icon2.png", multiplier: 2 },
        ]);
    });

    test("should return an empty array if no assets are found", async () => {
        (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue({ Items: [] }) });

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
        (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue({ Item: { asset_id: "asset123" } }) }); // Mock GetCommand for asset existence
        (addJobToWriteQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue({}) }); // Mock PutCommand for ticket creation
        (addJobToWriteQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue({}) }); // Mock PutCommand for watchlist

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
        expect(addJobToReadQueue).toHaveBeenCalledTimes(2);
        expect(addJobToWriteQueue).toHaveBeenCalledTimes(2);
    });

    test("should throw an error if asset does not exist", async () => {
        (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue({}) }); // Mock empty response for asset check

        await expect(ticketsService.createTicket(formData, mockFile)).rejects.toThrow("NoItems");
    });
});


describe("tickets service - addWatchlist", () => {
    const ticketData = {
        username: "testUser",
        ticket_id: "ticket123",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should add ticket to watchlist", async () => {
    });

    test("should throw error if ticket is already in watchlist", async () => {
    });

    test("should throw an error if ticket does not exist", async () => {
        (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue({ Items: [] }) });  // Mock no existing watchlist entry
        (addJobToWriteQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue({}) });

        await expect(ticketsService.addWatchlist(ticketData)).rejects.toThrow("TicketDoesntExists");
    });
});




describe("tickets service - getTicketDetails", () => {
    const ticketId = "79176f6b-64ed-4edb-b070-4e4fad5ae641";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return ticket details for a valid ticket ID", async () => {

    });

    test("should throw an error if ticket does not exist", async () => {
        (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue({}) }); // Mock no ticket found

        await expect(ticketsService.viewTicketData(ticketId)).rejects.toThrow("Failed to get Ticket data");
    });
});


describe("tickets service - deleteTicket", () => {
    const ticketId = "bd9969b3-9794-4aa3-aca1-b24aecbfda53";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should close ticket successfully", async () => {
    });

    test("should throw an error if ticket does not exist", async () => {
        (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue({}) }); // Mock no ticket found

        await expect(ticketsService.closeTicket(ticketId)).rejects.toThrow("TicketDoesntExist");
    });
});