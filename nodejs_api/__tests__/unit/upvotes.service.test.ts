// import { searchUpvotes } from "../../src/services/upvotes.service";
// import { dynamoDBDocumentClient } from "../../src/config/dynamodb.config";
// import { BadRequestError } from "../../src/types/error.types";
// import { ScanCommand } from "@aws-sdk/lib-dynamodb";

// jest.mock("../../src/config/dynamodb.config", () => ({
//     dynamoDBDocumentClient: {
//         send: jest.fn(),
//     },
// }));

// describe("Upvotes Service - searchUpvotes", () => {
//     const validSearchTerm = "testuser";
//     const invalidSearchTerm = "test@user"; // Invalid because of special character

//     afterEach(() => {
//         jest.clearAllMocks(); // Clear mocks between tests
//     });

//     it("should return items when search term is valid", async () => {
//         // Mock a successful response
//         const mockItems = [{ user_id: "testuser1" }, { user_id: "testuser2" }];
//         (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce({ Items: mockItems });

//         const result = await searchUpvotes(validSearchTerm);

//         // Assertions
//         expect(dynamoDBDocumentClient.send).toHaveBeenCalledWith(
//             expect.any(ScanCommand) // Check that a ScanCommand was sent
//         );
//         expect(result).toEqual(mockItems);
//     });

//     it("should throw a BadRequestError for an invalid search term", async () => {
//         await expect(searchUpvotes(invalidSearchTerm)).rejects.toThrow(BadRequestError);
//         await expect(searchUpvotes(invalidSearchTerm)).rejects.toThrow("Invalid search term");

//         // Ensure that send was not called
//         expect(dynamoDBDocumentClient.send).not.toHaveBeenCalled();
//     });

//     it("should throw a BadRequestError if the DynamoDB call fails", async () => {
//         // Mock an error during the DynamoDB call
//         const mockError = new Error("DynamoDB Error");
//         (dynamoDBDocumentClient.send as jest.Mock).mockRejectedValueOnce(mockError);

//         await expect(searchUpvotes(validSearchTerm)).rejects.toThrow(BadRequestError);
//         await expect(searchUpvotes(validSearchTerm)).rejects.toThrow("Failed to search upvotes: Cannot read properties of undefined (reading 'Items')");

//         // Ensure that send was called with the correct command
//         expect(dynamoDBDocumentClient.send).toHaveBeenCalledWith(
//             expect.any(ScanCommand) // Check that a ScanCommand was sent
//         );
//     });
// });
