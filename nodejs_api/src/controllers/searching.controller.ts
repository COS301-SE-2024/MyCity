
import { Request, Response } from "express";
import * as searchingService from "../services/searching.service";
import { BadRequestError } from "../types/error.types";


export const searchTickets = (req: Request, res: Response) => {
    try {
        const queryParams = req.query;

        if (!queryParams || !queryParams["q"]) {
            throw new BadRequestError("Search term is required");
        }

        const searchTerm = queryParams["q"] as string;
        const userMunicipality = req.body["user_municipality"];

        if (!userMunicipality) {
            throw new BadRequestError("Missing required field: user_municipality");
        }

        const result = searchingService.searchTickets(userMunicipality, searchTerm);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const searchMunicipalities = (req: Request, res: Response) => {
    try {
        const searchTerm =  req.query["q"] as string;

        if (!searchTerm) {
            throw new BadRequestError("Search term is required");
        }

        const result = searchingService.searchMunicipalities(searchTerm);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const searchMunicipalityTickets = (req: Request, res: Response) => {
    try {
        const municipalityName =  req.query["q"] as string;

        if (!municipalityName) {
            throw new BadRequestError("Municipality name is required");
        }

        const result = searchingService.searchAltMunicipalityTickets(municipalityName);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const searchServiceProviders = (req: Request, res: Response) => {
    try {
        const searchTerm =  req.query["q"] as string;

        if (!searchTerm) {
            throw new BadRequestError("Search term is required");
        }

        const result = searchingService.searchServiceProviders(searchTerm);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};