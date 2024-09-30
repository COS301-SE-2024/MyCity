
import { Request, Response } from "express";
import * as watchlistService from "../services/watchlist.service";

export const searchWatchlist = async (req: Request, res: Response) => {
    const searchTerm = req.query["q"] as string;
    if (!searchTerm) {
        return res.status(400).json({ Error: "Missing parameter: q" });
    }

    try {
        const response = await watchlistService.searchWatchlist(searchTerm, req.originalUrl);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};