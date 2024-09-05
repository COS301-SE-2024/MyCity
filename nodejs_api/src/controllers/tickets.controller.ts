import { Request, Response } from 'express';
import * as ticketsService from '../services/tickets.service';

export const getMostUpvoted = async (req: Request, res: Response) => {
    try {
        const result = await ticketsService.getMostUpvoted();

        return res.status(200).json(result);

    } catch (error) {
        //return an error message
        return res.status(500).json({ error: "Something bad happened and the server could not process your request" });
    }
}


export const getWatchlist = async (req: Request, res: Response) => {
    try {
        const username = req.query["username"] as string;
        const result = await ticketsService.getWatchlist(username);

        return res.status(200).json(result);

    } catch (error) {
        //return an error message
        return res.status(500).json({ error: "Something bad happened and the server could not process your request" });
    }
}


export const getTicketsInMunicipality = async (req: Request, res: Response) => {
    try {
        const municipality = req.query.municipality as string;
        const result = await ticketsService.getTicketsInMunicipality(municipality);

        return res.status(200).json(result);

    } catch (error) {
        //return an error message
        return res.status(500).json({ error: "Something bad happened and the server could not process your request" });
    }
}