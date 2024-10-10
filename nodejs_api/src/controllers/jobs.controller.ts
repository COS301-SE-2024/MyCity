import { NextFunction, Request, Response } from "express";
import * as jobsService from "../services/jobs.service";
import { deleteAllCache, deleteCacheKey } from "../config/redis.config";
import { CustomError } from "../errors/CustomError";

export const getJobStatus = async (req: Request, res: Response, next: NextFunction) => {
    const jobType = req.params["type"];
    const jobId = req.params["id"];

    try {
        const job = await jobsService.getJob(jobId, jobType);

        if (!job) {
            throw new CustomError("Job not found", 404);
        }

        // Check job status
        if (await job.isCompleted()) {
            const response = await job.returnvalue;
            return res.status(200).json({ status: "completed", result: response });
        } else if (await job.isFailed()) {
            throw new CustomError(job.failedReason || "Job failed", 500);
        }

        // If job is still in progress, return its status
        return res.status(200).json({ status: "job in progress" });
    } catch (error: any) {
        next(error);
    }
};

export const removeCacheKey = async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = req.params["key"];

    try {
        if (!cacheKey) {
            throw new CustomError("Missing parameter: key", 400);
        }

        await deleteCacheKey(cacheKey);
        return res.status(200).json({ status: `cache cleared for key ${cacheKey}` });
    } catch (error: any) {
        next(error);
    }
};

export const removeAllCache = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deleteAllCache();
        return res.status(200).json({ status: "all cache cleared" });
    } catch (error: any) {
        next(error);
    }
};