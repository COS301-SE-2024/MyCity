// import { ScanCommand } from "@aws-sdk/lib-dynamodb";
// import { dynamoDBDocumentClient, WATCHLIST_TABLE } from "../../src/config/dynamodb.config";
// import { searchWatchlist } from "../../src/services/watchlist.service";
// import { BadRequestError } from "../../src/types/error.types";

// // Mock DynamoDB client
// jest.mock("@aws-sdk/lib-dynamodb", () => ({
//     ScanCommand: jest.fn(),
// }));

// jest.mock("../../src/config/dynamodb.config", () => ({
//     dynamoDBDocumentClient: {
//         send: jest.fn(),
//     },
//     WATCHLIST_TABLE: "mocked_watchlist_table",
// }));

// describe("Watchlist Service", () => {
//     beforeEach(() => {
//         jest.clearAllMocks(); // Reset mocks before each test
//     });

//     describe("searchWatchlist", () => {
//         it("should return items when search is successful", async () => {
//             // Mock response from DynamoDB
//             const mockItems = [{ user_id: "123" }, { user_id: "456" }];
//             (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce({
//                 Items: mockItems,
//             });

//             const searchTerm = "John";
//             const result = await searchWatchlist(searchTerm);

//             expect(dynamoDBDocumentClient.send).toHaveBeenCalledWith(
//                 new ScanCommand({
//                     TableName: "mocked_watchlist_table",
//                     FilterExpression: "contains(user_id, :searchTerm)",
//                     ExpressionAttributeValues: {
//                         ":searchTerm": searchTerm,
//                     },
//                 })
//             );
//             expect(result).toEqual(mockItems);
//         });

//         it("should return an empty array if no items found", async () => {
//             (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce({
//                 Items: [],
//             });

//             const searchTerm = "Jane";
//             const result = await searchWatchlist(searchTerm);

//             expect(dynamoDBDocumentClient.send).toHaveBeenCalledWith(
//                 new ScanCommand({
//                     TableName: "mocked_watchlist_table",
//                     FilterExpression: "contains(user_id, :searchTerm)",
//                     ExpressionAttributeValues: {
//                         ":searchTerm": searchTerm,
//                     },
//                 })
//             );
//             expect(result).toEqual([]);
//         });

//         it("should throw a BadRequestError if the search term is invalid", async () => {
//             const searchTerm = "Invalid#$Term";

//             await expect(searchWatchlist(searchTerm)).rejects.toThrow(
//                 new BadRequestError("Invalid search term")
//             );
//         });

//         it("should throw a BadRequestError if DynamoDB throws an error", async () => {
//             const searchTerm = "John";
//             const mockError = new Error("DynamoDB error");

//             (dynamoDBDocumentClient.send as jest.Mock).mockRejectedValueOnce(mockError);

//             await expect(searchWatchlist(searchTerm)).rejects.toThrow(
//                 new BadRequestError(`Failed to search service providers: ${mockError.message}`)
//             );
//         });
//     });
// });
