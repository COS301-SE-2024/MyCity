import * as municipalitiesService from "../../src/services/municipalities.service";
import { dynamoDBDocumentClient } from "../../src/config/dynamodb.config";
import { ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Mock the dynamoDBDocumentClient's send method
jest.mock("../../src/config/dynamodb.config");

describe("Municipalities Service", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    describe("getAllMunicipalities", () => {
        it("should return a sorted list of municipalities", async () => {
            // Define the expected return value for the ScanCommand
            const mockResponse = {
                Items: [
                    { municipality_id: "2" },
                    { municipality_id: "1" },
                    { municipality_id: "3" }
                ]
            };

        });

        it("should return an empty list when no municipalities are found", async () => {
            // Define an empty response
            const mockEmptyResponse = { Items: [] };
        });
    });

    describe("getMunicipalityCoordinates", () => {
        it("should return the correct latitude and longitude for a municipality", async () => {
            const mockMunicipality = "123";
        });

        it("should return null if no coordinates are found for the municipality", async () => {
            const mockMunicipality = "non-existing-id";
        });
    });
});
