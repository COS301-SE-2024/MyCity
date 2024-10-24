import { Request, Response, NextFunction } from "express";
import { getJobStatus, removeCacheKey, removeAllCache } from "../../src/controllers/jobs.controller";
import * as jobsService from "../../src/services/jobs.service";
import { deleteAllCache, deleteCacheKey } from "../../src/config/redis.config";
import { CustomError } from "../../src/errors/CustomError";

// Mock dependencies
jest.mock('../../src/services/jobs.service', () => ({
    getJob: jest.fn(),
  }));  
jest.mock("../../src/config/redis.config");

describe("Jobs Controller", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe("getJobStatus", () => {
        it("should return completed status if job is completed", async () => {
            const mockJob = {
                isCompleted: jest.fn().mockResolvedValue(true),
                isFailed: jest.fn(),
                returnvalue: { data: "job result" }
            };
            mockRequest = { params: { id: "123", type: "type1" } };
            (jobsService.getJob as jest.Mock).mockResolvedValue(mockJob);

            await getJobStatus(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(jobsService.getJob).toHaveBeenCalledWith("123", "type1");
            expect(mockJob.isCompleted).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ status: "completed", result: mockJob.returnvalue });
        });

        it("should return job in progress if job is not completed", async () => {
            const mockJob = {
                isCompleted: jest.fn().mockResolvedValue(false),
                isFailed: jest.fn().mockResolvedValue(false)
            };
            mockRequest = { params: { id: "123", type: "type1" } };
            (jobsService.getJob as jest.Mock).mockResolvedValue(mockJob);

            await getJobStatus(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(jobsService.getJob).toHaveBeenCalledWith("123", "type1");
            expect(mockJob.isCompleted).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ status: "job in progress" });
        });

        it("should return 500 if job has failed", async () => {
            const mockJob = {
                isCompleted: jest.fn().mockResolvedValue(false),
                isFailed: jest.fn().mockResolvedValue(true),
                failedReason: "Job error"
            };
            mockRequest = { params: { id: "123", type: "type1" } };
            (jobsService.getJob as jest.Mock).mockResolvedValue(mockJob);

            await getJobStatus(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalledWith(new CustomError("Job error", 500));
        });

        it("should return 404 if job is not found", async () => {
            mockRequest = { params: { id: "123", type: "type1" } };
            (jobsService.getJob as jest.Mock).mockResolvedValue(null);

            await getJobStatus(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalledWith(new CustomError("Job not found", 404));
        });

        it("should handle errors by calling next function", async () => {
            const error = new Error("Test error");
            mockRequest = { params: { id: "123", type: "type1" } };
            (jobsService.getJob as jest.Mock).mockRejectedValue(error);

            await getJobStatus(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalledWith(error);
        });
    });

    describe("removeCacheKey", () => {
        it("should return 400 if cache key is missing", async () => {
            mockRequest = { params: {} };

            await removeCacheKey(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalledWith(new CustomError("Missing parameter: key", 400));
        });

        it("should clear cache for the given key", async () => {
            mockRequest = { params: { key: "cache-key" } };

            await removeCacheKey(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(deleteCacheKey).toHaveBeenCalledWith("cache-key");
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ status: "cache cleared for key cache-key" });
        });

        it("should handle errors by calling next function", async () => {
            const error = new Error("Test error");
            mockRequest = { params: { key: "cache-key" } };
            (deleteCacheKey as jest.Mock).mockRejectedValue(error);

            await removeCacheKey(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalledWith(error);
        });
    });

    describe("removeAllCache", () => {
        it("should clear all cache", async () => {
            await removeAllCache(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(deleteAllCache).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ status: "all cache cleared" });
        });

        it("should handle errors by calling next function", async () => {
            const error = new Error("Test error");
            (deleteAllCache as jest.Mock).mockRejectedValue(error);

            await removeAllCache(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalledWith(error);
        });
    });
});
