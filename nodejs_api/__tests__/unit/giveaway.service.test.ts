import { GIVEAWAY_TABLE, TICKETS_TABLE } from "../../src/config/dynamodb.config";
import { addJobToReadQueue, addJobToWriteQueue } from "../../src/services/jobs.service";
import * as giveawayService from "../../src/services/giveaway.service";
import { CustomError } from "../../src/errors/CustomError";
import { deleteCacheKey } from "../../src/config/redis.config";

jest.mock("../../src/services/jobs.service");
jest.mock("../../src/config/redis.config");

describe("Giveaway Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getParticipantCount", () => {
        it("should return the count of participants", async () => {
            const mockResponse = {
                Count: 5,
            };

            (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue(mockResponse) });

            const result = await giveawayService.getParticipantCount();

            expect(result).toEqual({ count: 5 });
            expect(addJobToReadQueue).toHaveBeenCalledWith(expect.objectContaining({
                params: {
                    TableName: GIVEAWAY_TABLE,
                    Select: "COUNT"
                }
            }));
            expect(addJobToReadQueue).toHaveBeenCalledTimes(1);
        });

        it("should return a count of 0 if no participants are found", async () => {
            const mockResponse = {
                Count: null,
            };

            (addJobToReadQueue as jest.Mock).mockResolvedValue({ finished: jest.fn().mockResolvedValue(mockResponse) });

            const result = await giveawayService.getParticipantCount();

            expect(result).toEqual({ count: 0 });
            expect(addJobToReadQueue).toHaveBeenCalledWith(expect.objectContaining({
                params: {
                    TableName: GIVEAWAY_TABLE,
                    Select: "COUNT"
                }
            }));
            expect(addJobToReadQueue).toHaveBeenCalledTimes(1);
        });
    });

    describe("addParticipant", () => {

        it("should throw an error if the ticket number is invalid", async () => {
            const mockFormData = {
                ticketNumber: "INVALID_TICKET",
            };

            const mockTicketResponse = {
                Items: [],
            };

            (addJobToReadQueue as jest.Mock).mockResolvedValueOnce({ finished: jest.fn().mockResolvedValue(mockTicketResponse) });

            await expect(giveawayService.addParticipant(mockFormData)).rejects.toThrow(CustomError);
            expect(addJobToReadQueue).toHaveBeenCalledWith(expect.objectContaining({
                params: {
                    TableName: TICKETS_TABLE,
                    IndexName: "ticketnumber-index",
                    KeyConditionExpression: "ticketnumber = :ticketnumber",
                    ExpressionAttributeValues: { ":ticketnumber": mockFormData.ticketNumber }
                }
            }));
            expect(addJobToReadQueue).toHaveBeenCalledTimes(1);
        });

        it("should throw an error if no entry id is generated", async () => {
            const mockFormData = {
                email: "test@example.com",
                name: "Test User",
                phoneNumber: "123456789",
                ticketNumber: "TICKET123",
            };

            const mockTicketResponse = {
                Items: [{ ticketnumber: "TICKET123" }],
            };

            const mockParticipantCountResponse = {
                Count: 1,
            };

            (addJobToReadQueue as jest.Mock)
                .mockResolvedValueOnce({ finished: jest.fn().mockResolvedValue(mockTicketResponse) })
                .mockResolvedValueOnce({ finished: jest.fn().mockResolvedValue(mockParticipantCountResponse) });

            jest.spyOn(Math, 'random').mockReturnValue(0);

            await expect(giveawayService.addParticipant(mockFormData)).rejects.toThrow(CustomError);

            expect(addJobToReadQueue).toHaveBeenCalledTimes(21);
        });
    });
});
