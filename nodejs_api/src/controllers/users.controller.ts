
import { Request, Response } from "express";
import * as usersService from "../services/users.service";

export const uploadProfilePicture = async (req: Request, res: Response) => {
    try {
        const response = await usersService.uploadProfilePicture(req);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};