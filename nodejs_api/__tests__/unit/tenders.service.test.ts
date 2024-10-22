import { addJobToReadQueue, addJobToWriteQueue } from "../../src/services/jobs.service";
import * as tendersService from "../../src/services/tenders.service";
import { BadRequestError } from "../../src/types/error.types";

// Mocking dependencies
jest.mock("../../src/utils/tickets.utils", () => ({
    generateId: jest.fn(() => "mockedId"),
    getCompanyIDFromName: jest.fn(),
}));

jest.mock("../../src/utils/tenders.utils", () => ({
    sendWebSocketMessage: jest.fn(),
}));

describe("createTender", () => {
    const mockGetCompanyIDFromName = require("../../src/utils/tickets.utils").getCompanyIDFromName;

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test to ensure no residual state
    });

    test("should create a tender successfully", async () => {
        // Arrange
        const senderData = {
            company_name: "Valid Company",
            quote: "1000",
            ticket_id: "ticket123",
            duration: "5",
        };

        mockGetCompanyIDFromName.mockResolvedValueOnce("companyId");
        
        (addJobToWriteQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue({ Items: []}) }); // No existing tender
        (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue({ Items: []}) });

        // Act
        const result = await tendersService.createTender(senderData);

        // Assert
        expect(result).toEqual({
            Status: "Success",
            message: "Tender created successfully",
            tender_id: "mockedId",
        });

        expect(addJobToWriteQueue).toHaveBeenCalledTimes(1);
        expect(addJobToWriteQueue).toHaveBeenCalledWith(
            expect.anything()
        );
    });

    test("should throw an error if company does not exist", async () => {
        // Arrange
        const senderData = {
            company_name: "Invalid Company",
            quote: "1000",
            ticket_id: "ticket123",
            duration: "5",
        };

        mockGetCompanyIDFromName.mockResolvedValueOnce(null); // Simulating no company found

        // Act & Assert
        await expect(tendersService.createTender(senderData)).rejects.toThrow(BadRequestError);
        await expect(tendersService.createTender(senderData)).rejects.toThrow("Company Does not Exist");

        expect(addJobToReadQueue).not.toHaveBeenCalled(); // No database calls should be made
    });

    test("should throw an error if company already has a tender on this Ticket", async () => {
    });
    
});
