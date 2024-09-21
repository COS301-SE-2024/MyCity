
import { Request, Response } from "express";
import * as watchlistService from "../services/watchlist.service";
import { BadRequestError } from "../types/error.types";

export const searchWatchlist = async (req: Request, res: Response) => {
    try {
        const searchTerm =  req.query["q"] as string;
        if (!searchTerm) {
            throw new BadRequestError("Search term is required");
        }
        const response = await watchlistService.searchWatchlist(searchTerm);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};