import * as analyticsService from "../../src/services/analytics.service";
import { dynamoDBDocumentClient } from "../../src/config/dynamodb.config";

jest.mock("../../src/config/dynamodb.config");

describe("Analytics Service", () => {
    const mockSend = jest.fn();
    (dynamoDBDocumentClient.send as jest.Mock) = mockSend;

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getTicketsPerMunicipality", () => {
        it("should return tickets for a given municipality", async () => {
            const municipalityId = "123";
            const mockResponse = { Items: [{ ticketId: "1" }, { ticketId: "2" }] };
            mockSend.mockResolvedValue(mockResponse);

            const result = await analyticsService.getTicketsPerMunicipality(municipalityId);

            expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
                input: {
                    TableName: "tickets_per_municipality",
                    KeyConditionExpression: "municipality_id = :municipality_id",
                    ExpressionAttributeValues: {
                        ":municipality_id": "123",
                    },
                }
            }));            
            expect(result).toEqual(mockResponse.Items);
        });

        it("should return an empty array if no tickets found", async () => {
            const municipalityId = "123";
            const mockResponse = { Items: [] };
            mockSend.mockResolvedValue(mockResponse);

            const result = await analyticsService.getTicketsPerMunicipality(municipalityId);

            expect(result).toEqual([]);
        });

        it("should handle errors gracefully", async () => {
            const municipalityId = "123";
            mockSend.mockRejectedValue(new Error("DynamoDB error"));

            await expect(analyticsService.getTicketsPerMunicipality(municipalityId)).rejects.toThrow("DynamoDB error");
        });
    });

    describe("getContractsPerServiceProvider", () => {
        it("should return contracts for a given service provider", async () => {
            const serviceProvider = "Provider1";
            const mockResponse = { Items: [{ contractId: "1" }, { contractId: "2" }] };
            mockSend.mockResolvedValue(mockResponse);

            const result = await analyticsService.getContractsPerServiceProvider(serviceProvider);

            expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
                input: {
                    TableName: "contracts_per_service_provider",
                    KeyConditionExpression: "service_provider = :service_provider",
                    ExpressionAttributeValues: {
                        ":service_provider": "Provider1",
                    },
                }
            }));

            expect(result).toEqual(mockResponse.Items);
        });

        it("should return an empty array if no contracts found", async () => {
            const serviceProvider = "Provider1";
            const mockResponse = { Items: [] };
            mockSend.mockResolvedValue(mockResponse);

            const result = await analyticsService.getContractsPerServiceProvider(serviceProvider);

            expect(result).toEqual([]);
        });

        it("should handle errors gracefully", async () => {
            const serviceProvider = "Provider1";
            mockSend.mockRejectedValue(new Error("DynamoDB error"));

            await expect(analyticsService.getContractsPerServiceProvider(serviceProvider)).rejects.toThrow("DynamoDB error");
        });
    });

    describe("getTendersPerServiceProvider", () => {
        it("should return tenders for a given service provider", async () => {
            const serviceProvider = "Provider1";
            const mockResponse = { Items: [{ tenderId: "1" }, { tenderId: "2" }] };
            mockSend.mockResolvedValue(mockResponse);

            const result = await analyticsService.getTendersPerServiceProvider(serviceProvider);


            expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
                input: {
                    TableName: "tenders_per_service_provider",
                    KeyConditionExpression: "service_provider = :service_provider",
                    ExpressionAttributeValues: {
                        ":service_provider": "Provider1",
                    },
                }
            }));

            expect(result).toEqual(mockResponse.Items);
        });

        it("should return an empty array if no tenders found", async () => {
            const serviceProvider = "Provider1";
            const mockResponse = { Items: [] };
            mockSend.mockResolvedValue(mockResponse);

            const result = await analyticsService.getTendersPerServiceProvider(serviceProvider);

            expect(result).toEqual([]);
        });

        it("should handle errors gracefully", async () => {
            const serviceProvider = "Provider1";
            mockSend.mockRejectedValue(new Error("DynamoDB error"));

            await expect(analyticsService.getTendersPerServiceProvider(serviceProvider)).rejects.toThrow("DynamoDB error");
        });
    });
});
