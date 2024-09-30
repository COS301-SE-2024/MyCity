import { DB_GET, DB_QUERY, DB_SCAN, DB_PUT, getFromCache, getReadQueue, getWriteQueue, removeRedisCacheKeys } from "../config/redis.config";
import { dynamoDBDocumentClient } from "../config/dynamodb.config";
import { GetCommand, PutCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DoneCallback, Job, JobOptions } from "bull";
import { JobData } from "../types/job.types";

export const getJob = async (jobId: string, jobType: string) => {
    if (jobType === "read") {
        const readQueue = await getReadQueue();
        const job = await readQueue.getJob(jobId);
        return job;
    } else if (jobType === "write") {
        const writeQueue = await getWriteQueue();
        const job = await writeQueue.getJob(jobId);
        return job;
    }
    else {
        throw new Error("Unsupported job type, cannot get job status");
    }
};


export const addJobToReadQueue = async (jobData: JobData, options?: JobOptions) => {
    const readQueue = await getReadQueue();
    const job = await readQueue.add({
        type: jobData.type,
        params: jobData.params,
        cacheKey: jobData.cacheKey
    }, options);

    return job;
};

export const addJobToWriteQueue = async (jobData: JobData, options?: JobOptions) => {
    const writeQueue = await getWriteQueue();
    const job = await writeQueue.add({
        type: jobData.type,
        params: jobData.params
    }, options);

    return job;
};

// job processor to handle read operations
export const readQueueProcessor = async (job: Job, done: DoneCallback) => {
    const { type, params, cacheKey } = job.data as JobData;

    try {
        if (cacheKey) {
            const cachedResponse = await getFromCache(cacheKey);
            if (cachedResponse) {
                done(null, cachedResponse);    // finish the job and return the cached response
                return;
            }
        }

        if (type === DB_SCAN) {
            const command = new ScanCommand(params);
            const response = await dynamoDBDocumentClient.send(command);
            done(null, response);    // finish the job and return the result
            return;
        }
        else if (type === DB_QUERY) {
            const command = new QueryCommand(params);
            const response = await dynamoDBDocumentClient.send(command);
            done(null, response);
            return;
        }
        else if (type === DB_GET) {
            const command = new GetCommand(params);
            const response = await dynamoDBDocumentClient.send(command);
            done(null, response);
            return;
        }
        else {
            done(new Error("Unsupported read job type, cannot process job"));
        }
    } catch (error: any) {
        done(error);
    }
};

// job processor to handle write operations
export const writeQueueProcessor = async (job: Job, done: DoneCallback) => {
    const { type, params } = job.data as JobData;
    try {
        if (type === DB_PUT) {
            const command = new PutCommand(params);
            await dynamoDBDocumentClient.send(command);
            done();    // finish the job
        }
        else {
            done(new Error("Unsupported write job type, cannot process job"));
        }
    } catch (error: any) {
        done(error);
    }
};





export const invalidateCacheOnTicketUpdate = async () => {
    const ticketsInvalidationList = [
        "/tickets/view",
        "/tickets/getmytickets",
        "/tickets/getinarea",
        "/tickets/getopeninarea",
        "/tickets/getwatchlist",
        "/tickets/getUpvotes",
        "/tickets/getcompanytickets",
        "/tickets/getopencompanytickets",
        "/tickets/comments"
    ];
    const searchInvalidationList = [
        "/search/issues",
        "/search/municipality-tickets"
    ];
    await removeRedisCacheKeys([...ticketsInvalidationList, ...searchInvalidationList]);
};


export const invalidateCacheOnNotificationsUpdate = async () => {
    const notificationInvalidationList = [
        "/notifications/get-tokens"
    ];
    await removeRedisCacheKeys(notificationInvalidationList);
};

export const invalidateCacheOnTenderUpdate = async () => {
    const tenderInvalidationList = [
        "/tenders/getmytenders",
        "/tenders/getmunitenders",
        "/tenders/getmunicipalitytenders",
        "/tenders/getcontracts",
        "/tenders/getmunicontract",
        "/tenders/getcompanycontracts",
        "/tenders/getcompanycontractbyticket"
    ];
    await removeRedisCacheKeys(tenderInvalidationList);
}