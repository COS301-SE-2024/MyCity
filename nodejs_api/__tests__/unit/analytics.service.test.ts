import { CONTRACTS_PER_SERVICE_PROVIDER_TABLE, TENDERS_PER_SERVICE_PROVIDER_TABLE, TICKETS_PER_MUNICIPALITY_TABLE } from "../../src/config/dynamodb.config";
import * as analyticsService from "../../src/services/analytics.service";
import { addJobToReadQueue } from "../../src/services/jobs.service";

describe("Analytics Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getTicketsPerMunicipality", () => {
        it("should return tickets for a given municipality", async () => {
            const municipalityId = "123";
            const mockResponse = { Items: [{ ticketId: "1" }, { ticketId: "2" }] };

            (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue(mockResponse) });

            const result = await analyticsService.getTicketsPerMunicipality(municipalityId);

            expect(addJobToReadQueue).toHaveBeenCalledWith(expect.objectContaining({
                params: {
                    TableName: TICKETS_PER_MUNICIPALITY_TABLE,
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
            (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue(mockResponse) });

            const result = await analyticsService.getTicketsPerMunicipality(municipalityId);

            expect(result).toEqual([]);
        });

        it("should handle errors gracefully", async () => {
            const municipalityId = "123";
            (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockRejectedValue(new Error("DynamoDB error")) });

            await expect(analyticsService.getTicketsPerMunicipality(municipalityId)).rejects.toThrow("DynamoDB error");
        });
    });

    describe("getContractsPerServiceProvider", () => {
        it("should return contracts for a given service provider", async () => {
            const serviceProvider = "Provider1";
            const mockResponse = { Items: [{ contractId: "1" }, { contractId: "2" }] };
            (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue(mockResponse) });

            const result = await analyticsService.getContractsPerServiceProvider(serviceProvider);

            expect(addJobToReadQueue).toHaveBeenCalledWith(expect.objectContaining({
                params: {
                    TableName: CONTRACTS_PER_SERVICE_PROVIDER_TABLE,
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
            (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue(mockResponse) });

            const result = await analyticsService.getContractsPerServiceProvider(serviceProvider);

            expect(result).toEqual([]);
        });

        it("should handle errors gracefully", async () => {
            const serviceProvider = "Provider1";
            (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockRejectedValue(new Error("DynamoDB error")) });

            await expect(analyticsService.getContractsPerServiceProvider(serviceProvider)).rejects.toThrow("DynamoDB error");
        });
    });

    describe("getTendersPerServiceProvider", () => {
        it("should return tenders for a given service provider", async () => {
            const serviceProvider = "Provider1";
            const mockResponse = { Items: [{ tenderId: "1" }, { tenderId: "2" }] };
            (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue(mockResponse) });

            const result = await analyticsService.getTendersPerServiceProvider(serviceProvider);


            expect(addJobToReadQueue).toHaveBeenCalledWith(expect.objectContaining({
                params: {
                    TableName: TENDERS_PER_SERVICE_PROVIDER_TABLE,
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
            (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue(mockResponse) });

            const result = await analyticsService.getTendersPerServiceProvider(serviceProvider);

            expect(result).toEqual([]);
        });

        it("should handle errors gracefully", async () => {
            const serviceProvider = "Provider1";
            (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockRejectedValue(new Error("DynamoDB error")) });

            await expect(analyticsService.getTendersPerServiceProvider(serviceProvider)).rejects.toThrow("DynamoDB error");
        });
    });
});
