import { NextFunction, Request, Response } from "express";
import { createClient, RedisClientType  } from "redis";

const REDIS_HOST = String(process.env.REDIS_HOST);
const REDIS_PORT = Number(process.env.REDIS_PORT);

let redisClient: RedisClientType | null = null;

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



// middleware to cache responses
export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = `${req.baseUrl}${req.url}`;
    console.log("cache key:", cacheKey);

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

export const cacheResponse = async (cacheKey: string, duration: number, response: any[]) => {
    //cache response for duration amount of time (default is 1 hour)
    const client = await getRedisClient();
    client.setEx(cacheKey, duration, JSON.stringify(response));
};