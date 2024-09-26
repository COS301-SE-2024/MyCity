import { Request, Response } from "express";
import * as tendersService from "../services/tenders.service";

export const createTender = async (req: Request, res: Response) => {
    try {
        const senderData = req.body;
        const response = await tendersService.createTender(senderData);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const inReview = async (req: Request, res: Response) => {
    try {
        const senderData = req.body;
        const tenders = await tendersService.inReview(senderData);
        return res.status(200).json(tenders);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const acceptTender = async (req: Request, res: Response) => {
    try {
        const senderData = req.body;
        const tenders = await tendersService.acceptTender(senderData);
        return res.status(200).json(tenders);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const rejectTender = async (req: Request, res: Response) => {
    try {
        const senderData = req.body;
        const tenders = await tendersService.rejectTender(senderData);
        return res.status(200).json(tenders);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const completeContract = async (req: Request, res: Response) => {
    try {
        const senderData = req.body;
        const tenders = await tendersService.completeContract(senderData);
        return res.status(200).json(tenders);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};


export const getCompanyTenders = async (req: Request, res: Response) => {
    try {
        const companyName = req.query["name"] as string;
        const response = await tendersService.getCompanyTenders(companyName);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
}

export const getMunicipalityTenders = async (req: Request, res: Response) => {
    try {
        const municipality = req.query["municipality"] as string;
        const response = await tendersService.getMunicipalityTenders(municipality);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getTicketTender = async (req: Request, res: Response) => {
    try {
        const ticketId = req.query["ticket"] as string;
        const response = await tendersService.getTicketTender(ticketId);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getContracts = async (req: Request, res: Response) => {
    try {
        const tenderId = req.query["tender"] as string;
        const response = await tendersService.getContracts(tenderId);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getCompanyContracts = async (req: Request, res: Response) => {
    try {
        const tenderId = req.query["tender"] as string;
        const companyName = req.query["company"] as string;
        const response = await tendersService.getCompanyContracts(tenderId, companyName);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};