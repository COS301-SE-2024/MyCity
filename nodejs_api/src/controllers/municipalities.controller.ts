
import { Request, Response } from "express";
import * as municipalitiesService from "../services/municipalities.service";

export const getAllMunicipalitiesList = async (req: Request, res: Response) => {
    try {
        const faultTypes = await municipalitiesService.getAllMunicipalities();
        return res.status(200).json(faultTypes);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};