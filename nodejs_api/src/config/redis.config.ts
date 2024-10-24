import JobQueue, { Queue, QueueOptions } from "bull";
import { NextFunction, Request, Response } from "express";
import Redis from "ioredis";
import { readQueueProcessor, writeQueueProcessor } from "../services/jobs.service";

const REDIS_HOST = String(process.env.REDIS_HOST);
const REDIS_PORT = Number(process.env.REDIS_PORT);

let redisClient: Redis | null = null;
let readQueue: Queue | null = null;
let writeQueue: Queue | null = null;

const DB_SCAN = "DB_SCAN";
const DB_QUERY = "DB_QUERY";
const DB_GET = "DB_GET";
const DB_PUT = "DB_PUT";
const DB_UPDATE = "DB_UPDATE";
const DEFAULT_CACHE_DURATION = 3600; // 1 hour

export {
    DB_SCAN,
    DB_QUERY,
    DB_GET,
    DB_PUT,
    DB_UPDATE,
    DEFAULT_CACHE_DURATION
}

const getRedisClient = () => {
    if (!redisClient) {
        redisClient = new Redis({
            host: REDIS_HOST,
            port: REDIS_PORT
        });

        redisClient.on("error", (err) => {
            console.error("Redis error:", err);
        });
    }

    return redisClient;
};

export const getReadQueue = () => {
    if (!readQueue) {
        const queueOptions: QueueOptions = {
            redis: {
                host: REDIS_HOST,
                port: REDIS_PORT,
                enableReadyCheck: false,
                maxRetriesPerRequest: null,
            }
        };

        readQueue = new JobQueue("readQueue", queueOptions);
    }

    return readQueue;
};

export const getWriteQueue = () => {
    if (!writeQueue) {
        const queueOptions: QueueOptions = {
            redis: {
                host: REDIS_HOST,
                port: REDIS_PORT,
                enableReadyCheck: false,
                maxRetriesPerRequest: null,
            }
        };

        writeQueue = new JobQueue("writeQueue", queueOptions);
    }

    return writeQueue;
};

// middleware to cache responses
export const checkCache = async (req: Request, res: Response, next: NextFunction) => {
    const client = getRedisClient();
    const cacheKey = req.originalUrl.toLowerCase();

    try {
        const cachedData = await client.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData)); // cache hit
        }

        next(); // cache miss, go to the next handler
    } catch (err) {
        console.error("Error fetching from Redis:", err);
        next(err);
    }
};

export const getFromCache = async (cacheKey: string) => {
    try {
        const client = getRedisClient();
        const cachedData = await client.get(cacheKey.toLowerCase());
        if (cachedData) {
            return JSON.parse(cachedData); // cache hit
        } else {
            return null; // cache miss
        }
    } catch (err) {
        console.error("Error fetching from Redis:", err);
        return null;
    }
};

export const cacheResponse = async (cacheKey: string, duration: number, response: any) => {
    if ((Array.isArray(response) && response.length > 0) || (typeof response === "object" && Object.keys(response).length > 0)) {
        //cache response for duration amount of time 
        const client = getRedisClient();
        client.setex(cacheKey.toLowerCase(), duration, JSON.stringify(response));
    }
};

export const deleteCacheKey = async (key: string) => {
    try {
        const client = getRedisClient();
        await client.del(key.toLowerCase());
    }
    catch (error) {
        console.error("Error deleting cache key:", error);
    }
};

export const deleteCacheKeys = async (keys: string[]) => {
    try {
        const client = getRedisClient();
        // delete cache for the given keys
        const lowercaseKeys = keys.map(key => key.toLowerCase());
        await client.del(...lowercaseKeys);
    } catch (error) {
        console.error("Error deleting cache keys:", error);
    }
};

export const deleteAllCache = async () => {
    try {
        const client = getRedisClient();
        //clear all the cache
        await client.flushall();
    } catch (error) {
        console.error("Error deleting cache:", error);
    }
};

export const processReadQueue = () => {
    const queue = getReadQueue();
    queue.process(1, readQueueProcessor);
};

export const processWriteQueue = () => {
    const queue = getWriteQueue();
    queue.process(1, writeQueueProcessor);
};