import { Request, Response } from "express";
import * as searchingService from "../services/searching.service";
import { BadRequestError } from "../types/error.types";

export const searchTickets = async (req: Request, res: Response) => {
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

        const result = await searchingService.searchTickets(userMunicipality, searchTerm);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const searchMunicipalities = async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query["q"] as string;

        if (!searchTerm) {
            throw new BadRequestError("Search term is required");
        }

        const result = await searchingService.searchMunicipalities(searchTerm);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const searchMunicipalityTickets = async (req: Request, res: Response) => {
    try {
        const municipalityName = req.query["q"] as string;

        if (!municipalityName) {
            throw new BadRequestError("Municipality name is required");
        }

        const result = await searchingService.searchAltMunicipalityTickets(municipalityName);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const searchServiceProviders = async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query["q"] as string;

        if (!searchTerm) {
            throw new BadRequestError("Search term is required");
        }

        const result = await searchingService.searchServiceProviders(searchTerm);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};