import exp from "constants";
import { MUNICIPALITIES_TABLE } from "../../src/config/dynamodb.config";
import { addJobToReadQueue } from "../../src/services/jobs.service";
import * as municipalityService from "../../src/services/municipalities.service";

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

            (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue(mockResponse) }); // Mock successful read job response

            const result = await municipalityService.getAllMunicipalities();

            expect(result).toEqual([
                { municipality_id: "A" },
                { municipality_id: "B" },
                { municipality_id: "C" },
            ]);
            expect(addJobToReadQueue).toHaveBeenCalledWith(expect.objectContaining({
                params: {
                    TableName: MUNICIPALITIES_TABLE,
                        ProjectionExpression: "municipality_id"
                }
            }));
            expect(addJobToReadQueue).toHaveBeenCalledTimes(1);
        });

        it("should return an empty list if no municipalities are found", async () => {
            const mockResponse = {
                Items: null,
            };

            (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue(mockResponse) }); // Mock empty response

            const result = await municipalityService.getAllMunicipalities();

            expect(result).toEqual([]);
            expect(addJobToReadQueue).toHaveBeenCalledWith(expect.objectContaining({
                params: {
                    TableName: MUNICIPALITIES_TABLE,
                    ProjectionExpression: "municipality_id"
                }
            }));
            expect(addJobToReadQueue).toHaveBeenCalledTimes(1);
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

            (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue(mockResponse) });

            const result = await municipalityService.getMunicipalityCoordinates(mockMunicipality);

            expect(result).toEqual(mockResponse.Item);
            expect(addJobToReadQueue).toHaveBeenCalledWith(expect.objectContaining({
                params: {
                    TableName: MUNICIPALITIES_TABLE,
                    Key: {
                        municipality_id: mockMunicipality,
                    },
                    ProjectionExpression: "latitude, longitude",
                }
            }
            ));
            expect(addJobToReadQueue).toHaveBeenCalledTimes(1);
        });

        it("should return null if no coordinates are found for the municipality", async () => {
            const mockMunicipality = "municipality_2";
            const mockResponse = {
                Item: null,
            };

            (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue(mockResponse) }); // Mock no coordinates response

            const result = await municipalityService.getMunicipalityCoordinates(mockMunicipality);

            expect(result).toBeNull();
            expect(addJobToReadQueue).toHaveBeenCalledWith(expect.objectContaining(
                {
                    params: {
                        TableName: "municipalities",
                        Key: {
                            municipality_id: mockMunicipality,
                        },
                        ProjectionExpression: "latitude, longitude",
                    }
                }
            ));
            expect(addJobToReadQueue).toHaveBeenCalledTimes(1);
        });
    });
});
