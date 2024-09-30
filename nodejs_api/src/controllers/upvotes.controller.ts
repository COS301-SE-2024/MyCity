import { Request, Response } from "express";
import * as upvotesService from "../services/upvotes.service";

export const searchUpvotes = async (req: Request, res: Response) => {
    const searchTerm = req.query["q"] as string;
    if (!searchTerm) {
        return res.status(400).json({ Error: "Missing parameter: q" });
    }

    try {
        const response = await upvotesService.searchUpvotes(searchTerm, req.originalUrl);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};