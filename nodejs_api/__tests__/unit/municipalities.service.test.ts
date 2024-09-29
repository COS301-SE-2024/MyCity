import * as municipalityService from "../../src/services/municipalities.service";
import { dynamoDBDocumentClient } from "../../src/config/dynamodb.config";
import { ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

jest.mock("@aws-sdk/lib-dynamodb", () => ({
    ScanCommand: jest.fn(),
    GetCommand: jest.fn(),
    DynamoDBDocumentClient: {
        from: jest.fn(() => ({
            send: jest.fn(),
        })),
    },
}));

describe("Municipality Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllMunicipalities", () => {
        it("should return a sorted list of all municipalities", async () => {
            const mockResponse = {
                Items: [
                    { municipality_id: "B" },
                    { municipality_id: "A" },
                    { municipality_id: "C" },
                ],
            };

            (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce(mockResponse); // Mock successful ScanCommand response

            const result = await municipalityService.getAllMunicipalities();

            expect(result).toEqual([
                { municipality_id: "A" },
                { municipality_id: "B" },
                { municipality_id: "C" },
            ]);
            expect(ScanCommand).toHaveBeenCalledWith({
                TableName: "municipalities",
            });
            expect(dynamoDBDocumentClient.send).toHaveBeenCalled();
        });

        it("should return an empty list if no municipalities are found", async () => {
            const mockResponse = {
                Items: [],
            };

            (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce(mockResponse); // Mock empty response

            const result = await municipalityService.getAllMunicipalities();

            expect(result).toEqual([]);
            expect(ScanCommand).toHaveBeenCalledWith({
                TableName: "municipalities",
            });
            expect(dynamoDBDocumentClient.send).toHaveBeenCalled();
        });
    });

    describe("getMunicipalityCoordinates", () => {
        it("should return the coordinates of a given municipality", async () => {
            const mockMunicipality = "municipality_1";
            const mockResponse = {
                Item: {
                    latitude: 12.345678,
                    longitude: 98.765432,
                },
            };

            (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce(mockResponse); // Mock successful GetCommand response

            const result = await municipalityService.getMunicipalityCoordinates(mockMunicipality);

            expect(result).toEqual(mockResponse.Item);
            expect(GetCommand).toHaveBeenCalledWith({
                TableName: "municipalities",
                Key: {
                    municipality_id: mockMunicipality,
                },
                ProjectionExpression: "latitude, longitude",
            });
            expect(dynamoDBDocumentClient.send).toHaveBeenCalled();
        });

        it("should return null if no coordinates are found for the municipality", async () => {
            const mockMunicipality = "municipality_2";
            const mockResponse = {
                Item: null,
            };

            (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce(mockResponse); // Mock no coordinates response

            const result = await municipalityService.getMunicipalityCoordinates(mockMunicipality);

            expect(result).toBeNull();
            expect(GetCommand).toHaveBeenCalledWith({
                TableName: "municipalities",
                Key: {
                    municipality_id: mockMunicipality,
                },
                ProjectionExpression: "latitude, longitude",
            });
            expect(dynamoDBDocumentClient.send).toHaveBeenCalled();
        });
    });
});
