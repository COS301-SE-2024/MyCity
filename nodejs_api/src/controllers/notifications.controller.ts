import { Request, Response } from "express";
import * as notificationsService from "../services/notifications.service";
import { cacheResponse, DEFAULT_CACHE_DURATION } from "../config/redis.config";

export const insertNotificationToken = async (req: Request, res: Response) => {
    const requiredFields = ["username", "deviceID", "token"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ Error: `Missing parameter(s): ${missingFields.join(", ")}` });
    }

    try {
        const ticketData = req.body;
        const response = await notificationsService.insertNotificationToken(ticketData);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getNotificationTokens = async (req: Request, res: Response) => {
    const username = req.query["username"] as string;
    if (!username) {
        return res.status(400).json({ Error: "Missing parameter: username" });
    }
    try {
        const response = await notificationsService.getNotificationTokens(username);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};