import { Request, Response } from "express";
import * as usersService from "../services/users.service";

export const uploadProfilePicture = async (req: Request, res: Response) => {
    const username = req.body["username"] as string;
    const file = req.file;

    if (!file || !username) {
        return res.status(400).json({ Error: "File or username missing" });
    }

    try {
        const response = await usersService.uploadProfilePicture(username, file);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};