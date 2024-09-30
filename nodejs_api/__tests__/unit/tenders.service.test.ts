// import * as tendersService from "../../src/services/tenders.service";
// import { dynamoDBDocumentClient } from "../../src/config/dynamodb.config";
// import { BadRequestError } from "../../src/types/error.types";
// import { QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

// // Mocking dependencies
// jest.mock("../../src/config/dynamodb.config", () => ({
//     dynamoDBDocumentClient: {
//         send: jest.fn(),
//     },
// }));
// jest.mock("../../src/utils/tickets.utils", () => ({
//     generateId: jest.fn(() => "mockedId"),
//     getCompanyIDFromName: jest.fn(),
// }));

// describe("createTender", () => {
//     const mockGetCompanyIDFromName = require("../../src/utils/tickets.utils").getCompanyIDFromName;

//     beforeEach(() => {
//         jest.clearAllMocks(); // Clear mocks before each test to ensure no residual state
//     });

//     test("should create a tender successfully", async () => {
//         // Arrange
//         const senderData = {
//             company_name: "Valid Company",
//             quote: "1000",
//             ticket_id: "ticket123",
//             duration: "5",
//         };

//         mockGetCompanyIDFromName.mockResolvedValueOnce("companyId");
        
//         (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce({ Items: [] }); // No existing tender

//         // Act
//         const result = await tendersService.createTender(senderData);

//         // Assert
//         expect(result).toEqual({
//             Status: "Success",
//             message: "Tender created successfully",
//             tender_id: "mockedId",
//         });

//         expect(dynamoDBDocumentClient.send).toHaveBeenCalledTimes(2); // Two calls: one for QueryCommand, one for PutCommand
//         expect(dynamoDBDocumentClient.send).toHaveBeenCalledWith(
//             expect.any(QueryCommand)
//         );
//         expect(dynamoDBDocumentClient.send).toHaveBeenCalledWith(
//             expect.any(PutCommand)
//         );
//     });

//     test("should throw an error if company does not exist", async () => {
//         // Arrange
//         const senderData = {
//             company_name: "Invalid Company",
//             quote: "1000",
//             ticket_id: "ticket123",
//             duration: "5",
//         };

//         mockGetCompanyIDFromName.mockResolvedValueOnce(null); // Simulating no company found

//         // Act & Assert
//         await expect(tendersService.createTender(senderData)).rejects.toThrow(BadRequestError);
//         await expect(tendersService.createTender(senderData)).rejects.toThrow("Company Does not Exist");

//         expect(dynamoDBDocumentClient.send).not.toHaveBeenCalled(); // No database calls should be made
//     });

//     test("should throw an error if company already has a tender on this Ticket", async () => {
//     });
    
// });
