import { Request, Response } from "express";
import * as analyticsService from "../services/analytics.service";

export const getTicketsPerMunicipality = async (req: Request, res: Response) => {
    const municipalityId = req.query["municipality_id"] as string;
    try {
        const response = await analyticsService.getTicketsPerMunicipality(municipalityId);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getContractsPerServiceProvider = async (req: Request, res: Response) => {
    const serviceProvider = req.query["service_provider"] as string;
    try {
        const response = await analyticsService.getContractsPerServiceProvider(serviceProvider);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getTendersPerServiceProvider = async (req: Request, res: Response) => {
    const serviceProvider = req.query["service_provider"] as string;
    try {
        const response = await analyticsService.getTendersPerServiceProvider(serviceProvider);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};