import { NextFunction, Request, Response } from "express";
import * as giveawayService from "../services/giveaway.service";
import { cacheResponse, DEFAULT_CACHE_DURATION } from "../config/redis.config";

export const getParticipantCount = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const response = await giveawayService.getParticipantCount();
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        next(error);
    }
};

export const addParticipant = async (req: Request, res: Response, next:NextFunction) => {
    const requiredFields = ["ticketNumber", "name", "email", "phoneNumber"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ Error: `Missing parameter(s): ${missingFields.join(", ")}` });
    }

    try {
        const formData = req.body;
        const response = await giveawayService.addParticipant(formData);
        return res.status(200).json(response);
    } catch (error: any) {
       next(error);
    }
};
