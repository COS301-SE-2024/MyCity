import { Request, Response } from "express";
import * as searchingService from "../services/searching.service";

export const searchTickets = async (req: Request, res: Response) => {
    const searchTerm = req.query["q"] as string;
    const userMunicipality = req.body["user_municipality"];

    if (!searchTerm || !userMunicipality) {
        return res.status(400).json({ Error: "Missing parameter(s): q and/or user_municipality" });
    }

    try {
        const result = await searchingService.searchTickets(userMunicipality, searchTerm);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const searchMunicipalities = async (req: Request, res: Response) => {
    const searchTerm = req.query["q"] as string;

    if (!searchTerm) {
        return res.status(400).json({ Error: "Missing parameter: q" });
    }

    try {
        const result = await searchingService.searchMunicipalities(searchTerm);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const searchMunicipalityTickets = async (req: Request, res: Response) => {
    const municipalityName = req.query["q"] as string;

    if (!municipalityName) {
        return res.status(400).json({ Error: "Missing parameter: q" });
    }

    try {
        const result = await searchingService.searchAltMunicipalityTickets(municipalityName);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const searchServiceProviders = async (req: Request, res: Response) => {
    const searchTerm = req.query["q"] as string;

    if (!searchTerm) {
        return res.status(400).json({ Error: "Missing parameter: q" });
    }

    try {
        const result = await searchingService.searchServiceProviders(searchTerm);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};