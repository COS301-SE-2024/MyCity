import { Request, Response } from "express";
import * as jobsService from "../services/jobs.service";
import { clearRedisCache, removeRedisKey } from "../config/redis.config";

export const getJobStatus = async (req: Request, res: Response) => {
    const jobType = req.params["type"];
    const jobId = req.params["id"];

    try {
        const job = await jobsService.getJob(jobId, jobType);

        if (!job) {
            return res.status(404).json({ Error: "job not found" });
        }

        // Check job status
        if (await job.isCompleted()) {
            const response = await job.returnvalue;
            return res.status(200).json({ status: "completed", result: response });
        } else if (await job.isFailed()) {
            return res.status(500).json({ status: "failed", error: job.failedReason });
        }

        // If job is still in progress, return its status
        return res.status(200).json({ status: "job in progress" });
    } catch (error: any) {
        return res.status(500).json({ status: "failed", error: error.message });
    }
};

export const removeKey = async (req: Request, res: Response) => {
    const cacheKey = req.params["key"];
    try {
        const response = await removeRedisKey(cacheKey);
        if (response) {
            return res.status(200).json({ status: `cache cleared for key ${cacheKey}` });
        }
        else {
            return res.status(500).json({ status: "failed", error: "cache not cleared" });
        }
    } catch (error: any) {
        return res.status(500).json({ status: "failed", error: error.message });
    }
};

export const clearCache = async (req: Request, res: Response) => {
    try {
        const response = await clearRedisCache();
        if (response) {
            return res.status(200).json({ status: "all cache cleared" });
        }
        else {
            return res.status(500).json({ status: "failed", error: "cache not cleared" });
        }
    } catch (error: any) {
        return res.status(500).json({ status: "failed", error: error.message });
    }
};