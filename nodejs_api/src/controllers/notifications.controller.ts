import { Request, Response } from "express";
import * as notificationsService from "../services/notifications.service";

export const insertNotificationToken = async (req: Request, res: Response) => {
    try {
        const ticketData = req.body;
        const response = await notificationsService.insertNotificationToken(ticketData);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getNotificationTokens = async (req: Request, res: Response) => {
    try {
        const username = req.query["username"] as string;
        const response = await notificationsService.getNotificationTokens(username);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};