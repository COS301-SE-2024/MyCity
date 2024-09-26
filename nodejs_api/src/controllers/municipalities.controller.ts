import { Request, Response } from "express";
import * as municipalitiesService from "../services/municipalities.service";

export const getAllMunicipalitiesList = async (req: Request, res: Response) => {
    try {
        const response = await municipalitiesService.getAllMunicipalities();
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getMunicipalityCoordinates = async (req: Request, res: Response) => {
    try {
        const municipality = req.query["municipality"] as string;
        if (!municipality) {
            return res.status(400).json({ error: "Municipality Not Found" });
        }
        const response = await municipalitiesService.getMunicipalityCoordinates(municipality);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};