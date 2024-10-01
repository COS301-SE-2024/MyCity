import { Request, Response } from "express";
import * as analyticsService from "../services/analytics.service";
import { cacheResponse, DEFAULT_CACHE_DURATION } from "../config/redis.config";

export const getTicketsPerMunicipality = async (req: Request, res: Response) => {
    const municipalityId = req.query["municipality_id"] as string;
    if (!municipalityId) {
        return res.status(400).json({ Error: "Missing parameter: municipality_id" });
    }

    try {
        const response = await analyticsService.getTicketsPerMunicipality(municipalityId);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getContractsPerServiceProvider = async (req: Request, res: Response) => {
    const serviceProvider = req.query["service_provider"] as string;
    if (!serviceProvider) {
        return res.status(400).json({ Error: "Missing parameter: service_provider" });
    }

    try {
        const response = await analyticsService.getContractsPerServiceProvider(serviceProvider);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getTendersPerServiceProvider = async (req: Request, res: Response) => {
    const serviceProvider = req.query["service_provider"] as string;
    if (!serviceProvider) {
        return res.status(400).json({ Error: "Missing parameter: service_provider" });
    }

    try {
        const response = await analyticsService.getTendersPerServiceProvider(serviceProvider);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};