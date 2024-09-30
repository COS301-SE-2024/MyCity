import JobQueue, { Queue, QueueOptions } from "bull";
import { NextFunction, Request, Response } from "express";
import { createClient, RedisClientType } from "redis";
import { readQueueProcessor, writeQueueProcessor } from "../services/jobs.service";

const REDIS_HOST = String(process.env.REDIS_HOST);
const REDIS_PORT = Number(process.env.REDIS_PORT);

let redisClient: RedisClientType | null = null;
let readQueue: Queue | null = null;
let writeQueue: Queue | null = null;

const DB_SCAN = "DB_SCAN";
const DB_QUERY = "DB_QUERY";
const DB_GET = "DB_GET";
const DB_PUT = "DB_PUT";
const DEFAULT_CACHE_DURATION = 3600; // 1 hour

export {
    DB_SCAN,
    DB_QUERY,
    DB_GET,
    DB_PUT,
    DEFAULT_CACHE_DURATION
}

const getRedisClient = async () => {
    if (!redisClient) {
        redisClient = createClient({
            socket: {
                host: REDIS_HOST,
                port: REDIS_PORT
            }
        });

        redisClient.on("error", (err) => {
            console.error("Redis error:", err);
        });

        // connect to Redis
        try {
            await redisClient.connect();
        } catch (err) {
            console.error("Error connecting to Redis:", err);
        }
    }

    return redisClient;
};

export const getReadQueue = async () => {
    if (!readQueue) {
        const queueOptions: QueueOptions = {
            redis: {
                host: REDIS_HOST,
                port: REDIS_PORT
            }
        };

        readQueue = new JobQueue("readQueue", queueOptions);
        readQueue.process(readQueueProcessor);
    }

    return readQueue;
};

export const getWriteQueue = async () => {
    if (!writeQueue) {
        const queueOptions: QueueOptions = {
            redis: {
                host: REDIS_HOST,
                port: REDIS_PORT
            }
        };

        writeQueue = new JobQueue("writeQueue", queueOptions);
        writeQueue.process(writeQueueProcessor);
    }

    return writeQueue;
};

// middleware to cache responses
export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = `${req.baseUrl}${req.url}`;

    try {
        const client = await getRedisClient();
        const cachedData = await client.get(cacheKey);
        if (cachedData !== null) {
            return res.json(JSON.parse(cachedData)); // cache hit
        } else {
            next(); // cache miss, go to the next handler
        }
    } catch (err) {
        console.error("Error fetching from Redis:", err);
        next();
    }
};

export const getFromCache = async (cacheKey: string) => {
    try {
        const client = await getRedisClient();
        const cachedData = await client.get(cacheKey);
        if (cachedData !== null) {
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
        const client = await getRedisClient();
        client.setEx(cacheKey, duration, JSON.stringify(response));
    }
};

export const removeRedisKey = async (key: string) => {
    const client = await getRedisClient();
    //clear all the cache
    const response = await client.del(key);
    return response === 1;
};

export const clearRedisCache = async () => {
    const client = await getRedisClient();
    //clear all the cache
    const response = await client.flushAll();
    return response;
};

export const removeRedisCacheKeys = async (keys: string[]) => {
    const client = await getRedisClient();
    // clear the cache for the given keys
    const response = await client.del(keys);
};