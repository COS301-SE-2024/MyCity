
import { Request, Response } from "express";
import * as upvotesService from "../services/upvotes.service";
import { BadRequestError } from "../types/error.types";

export const searchUpvotes = async (req: Request, res: Response) => {
    try {
        const searchTerm =  req.query["q"] as string;
        if (!searchTerm) {
            throw new BadRequestError("Search term is required");
        }
        const response = await upvotesService.searchUpvotes(searchTerm);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};