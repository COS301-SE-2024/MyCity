import { Request, Response } from "express";
import * as municipalitiesService from "../services/municipalities.service";
import { cacheResponse, DEFAULT_CACHE_DURATION } from "../config/redis.config";

export const getAllMunicipalitiesList = async (req: Request, res: Response) => {
    try {
        const response = await municipalitiesService.getAllMunicipalities(req.originalUrl);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getMunicipalityCoordinates = async (req: Request, res: Response) => {
    const municipality = req.query["municipality"] as string;
    if (!municipality) {
        return res.status(400).json({ Error: "Missing parameter: municipality" });
    }

    try {
        const response = await municipalitiesService.getMunicipalityCoordinates(municipality, req.originalUrl);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};