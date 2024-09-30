import { Request, Response } from "express";
import * as searchingService from "../services/searching.service";
import { cacheResponse, DEFAULT_CACHE_DURATION } from "../config/redis.config";

export const searchTickets = async (req: Request, res: Response) => {
    const searchTerm = req.query["q"] as string;
    const userMunicipality = req.body["user_municipality"];

    if (!searchTerm || !userMunicipality) {
        return res.status(400).json({ Error: "Missing parameter(s): q and/or user_municipality" });
    }

    try {
        const response = await searchingService.searchTickets(userMunicipality, searchTerm, req.originalUrl);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
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
        const response = await searchingService.searchMunicipalities(searchTerm, req.originalUrl);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
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
        const response = await searchingService.searchAltMunicipalityTickets(municipalityName, req.originalUrl);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
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
        const response = await searchingService.searchServiceProviders(searchTerm, req.originalUrl);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};