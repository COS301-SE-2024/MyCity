import * as searchingService from "../../src/services/searching.service";
import { dynamoDBDocumentClient } from "../../src/config/dynamodb.config";
import { BadRequestError } from "../../src/types/error.types";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

jest.mock("../../src/config/dynamodb.config", () => ({
    dynamoDBDocumentClient: {
        send: jest.fn(),
    },
}));

describe("Searching Service Tests", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks between tests
    });

    // Test for searchTickets function
    describe("searchTickets", () => {
        it("should return filtered tickets when search is successful", async () => {
            const userMunicipality = "testMunicipality";
            const searchTerm = "test";
            const mockItems = [
                { municipality_id: "testMunicipality", description: "test description", asset_id: "asset1" },
                { municipality_id: "testMunicipality", description: "another description", asset_id: "asset2" },
                { municipality_id: "otherMunicipality", description: "test description", asset_id: "asset3" }
            ];
            (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce({ Items: mockItems });

            const result = await searchingService.searchTickets(userMunicipality, searchTerm);

            expect(dynamoDBDocumentClient.send).toHaveBeenCalledWith(expect.any(ScanCommand));
            expect(result).toEqual([
                { municipality_id: "testMunicipality", description: "test description", asset_id: "asset1" }
            ]);
        });

        it("should throw BadRequestError for an invalid search term", async () => {
            const userMunicipality = "testMunicipality";
            const searchTerm = "test@user"; // Invalid search term

            await expect(searchingService.searchTickets(userMunicipality, searchTerm)).rejects.toThrow(BadRequestError);
            expect(dynamoDBDocumentClient.send).not.toHaveBeenCalled();
        });

        it("should throw BadRequestError if the DynamoDB call fails", async () => {
            const userMunicipality = "testMunicipality";
            const searchTerm = "test";
            const mockError = new Error("DynamoDB Error");
            (dynamoDBDocumentClient.send as jest.Mock).mockRejectedValueOnce(mockError);

            await expect(searchingService.searchTickets(userMunicipality, searchTerm)).rejects.toThrow(BadRequestError);
            expect(dynamoDBDocumentClient.send).toHaveBeenCalledWith(expect.any(ScanCommand));
        });
    });

    // Test for searchMunicipalities function
    describe("searchMunicipalities", () => {
        it("should return filtered municipalities when search is successful", async () => {
            const searchTerm = "test";
            const mockItems = [
                { municipality_id: "testMunicipality" },
                { municipality_id: "anotherMunicipality" }
            ];
            (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce({ Items: mockItems });

            const result = await searchingService.searchMunicipalities(searchTerm);

            expect(dynamoDBDocumentClient.send).toHaveBeenCalledWith(expect.any(ScanCommand));
            expect(result).toEqual([{ municipality_id: "testMunicipality" }]);
        });

        it("should throw BadRequestError for an invalid search term", async () => {
            const searchTerm = "test@municipality"; // Invalid search term

            await expect(searchingService.searchMunicipalities(searchTerm)).rejects.toThrow(BadRequestError);
            expect(dynamoDBDocumentClient.send).not.toHaveBeenCalled();
        });

        it("should throw BadRequestError if the DynamoDB call fails", async () => {
            const searchTerm = "test";
            const mockError = new Error("DynamoDB Error");
            (dynamoDBDocumentClient.send as jest.Mock).mockRejectedValueOnce(mockError);

            await expect(searchingService.searchMunicipalities(searchTerm)).rejects.toThrow(BadRequestError);
            expect(dynamoDBDocumentClient.send).toHaveBeenCalledWith(expect.any(ScanCommand));
        });
    });

    // Test for searchAltMunicipalityTickets function
    describe("searchAltMunicipalityTickets", () => {
        it("should return filtered tickets when search is successful", async () => {
            const municipalityName = "testMunicipality";
            const mockItems = [
                { municipality_id: "testMunicipality", description: "test description", asset_id: "asset1" },
                { municipality_id: "otherMunicipality", description: "other description", asset_id: "asset2" }
            ];
            (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce({ Items: mockItems });

            const result = await searchingService.searchAltMunicipalityTickets(municipalityName);

            expect(dynamoDBDocumentClient.send).toHaveBeenCalledWith(expect.any(ScanCommand));
            expect(result).toEqual([{ municipality_id: "testMunicipality", description: "test description", asset_id: "asset1" }]);
        });

        it("should throw BadRequestError for an invalid municipality name", async () => {
            const municipalityName = "test@municipality"; // Invalid municipality name

            await expect(searchingService.searchAltMunicipalityTickets(municipalityName)).rejects.toThrow(BadRequestError);
            expect(dynamoDBDocumentClient.send).not.toHaveBeenCalled();
        });

        it("should throw BadRequestError if the DynamoDB call fails", async () => {
            const municipalityName = "testMunicipality";
            const mockError = new Error("DynamoDB Error");
            (dynamoDBDocumentClient.send as jest.Mock).mockRejectedValueOnce(mockError);

            await expect(searchingService.searchAltMunicipalityTickets(municipalityName)).rejects.toThrow(BadRequestError);
            expect(dynamoDBDocumentClient.send).toHaveBeenCalledWith(expect.any(ScanCommand));
        });
    });

    // Test for searchServiceProviders function
    describe("searchServiceProviders", () => {
        it("should return filtered service providers when search is successful", async () => {
            const searchTerm = "test";
            const mockItems = [
                { name: "test service provider" },
                { name: "another service provider" }
            ];
            (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce({ Items: mockItems });

            const result = await searchingService.searchServiceProviders(searchTerm);

            expect(dynamoDBDocumentClient.send).toHaveBeenCalledWith(expect.any(ScanCommand));
            expect(result).toEqual([{ name: "test service provider" }]);
        });

        it("should throw BadRequestError for an invalid search term", async () => {
            const searchTerm = "test@provider"; // Invalid search term

            await expect(searchingService.searchServiceProviders(searchTerm)).rejects.toThrow(BadRequestError);
            expect(dynamoDBDocumentClient.send).not.toHaveBeenCalled();
        });

        it("should throw BadRequestError if the DynamoDB call fails", async () => {
            const searchTerm = "test";
            const mockError = new Error("DynamoDB Error");
            (dynamoDBDocumentClient.send as jest.Mock).mockRejectedValueOnce(mockError);

            await expect(searchingService.searchServiceProviders(searchTerm)).rejects.toThrow(BadRequestError);
            expect(dynamoDBDocumentClient.send).toHaveBeenCalledWith(expect.any(ScanCommand));
        });
    });
});