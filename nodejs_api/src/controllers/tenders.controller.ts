import { Request, Response } from "express";
import * as tendersService from "../services/tenders.service";
import { BadRequestError, NotFoundError } from "../types/error.types";
import { cacheResponse, DEFAULT_CACHE_DURATION } from "../config/redis.config";

export const createTender = async (req: Request, res: Response) => {
    const requiredFields = ["company_name", "quote", "ticket_id", "duration"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ Error: `Missing parameter(s): ${missingFields.join(", ")}` });
    }

    try {
        const senderData = req.body;
        const response = await tendersService.createTender(senderData);
        return res.status(200).json(response);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ Error: error.message });
        }
        else if (error instanceof BadRequestError) {
            return res.status(400).json({ Error: error.message });
        }
        return res.status(500).json({ Error: error.message });
    }
};

export const inReview = async (req: Request, res: Response) => {
    const requiredFields = ["company_name", "ticket_id"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ Error: `Missing parameter(s): ${missingFields.join(", ")}` });
    }

    try {
        const senderData = req.body;
        const tenders = await tendersService.inReview(senderData);
        return res.status(200).json(tenders);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ Error: error.message });
        }
        else if (error instanceof BadRequestError) {
            return res.status(400).json({ Error: error.message });
        }
        return res.status(500).json({ Error: error.message });
    }
};

export const acceptTender = async (req: Request, res: Response) => {
    const requiredFields = ["company_id", "ticket_id"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ Error: `Missing parameter(s): ${missingFields.join(", ")}` });
    }

    try {
        const senderData = req.body;
        const tenders = await tendersService.acceptTender(senderData);
        return res.status(200).json(tenders);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ Error: error.message });
        }
        else if (error instanceof BadRequestError) {
            return res.status(400).json({ Error: error.message });
        }
        return res.status(500).json({ Error: error.message });
    }
};

export const rejectTender = async (req: Request, res: Response) => {
    const requiredFields = ["company_id", "ticket_id"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ Error: `Missing parameter(s): ${missingFields.join(", ")}` });
    }

    try {
        const senderData = req.body;
        const tenders = await tendersService.rejectTender(senderData);
        return res.status(200).json(tenders);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ Error: error.message });
        }
        else if (error instanceof BadRequestError) {
            return res.status(400).json({ Error: error.message });
        }
        return res.status(500).json({ Error: error.message });
    }
};

export const completeContract = async (req: Request, res: Response) => {
    const requiredFields = ["contract_id"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ Error: `Missing parameter(s): ${missingFields.join(", ")}` });
    }

    try {
        const senderData = req.body;
        const tenders = await tendersService.completeContract(senderData);
        return res.status(200).json(tenders);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ Error: error.message });
        }
        else if (error instanceof BadRequestError) {
            return res.status(400).json({ Error: error.message });
        }
        return res.status(500).json({ Error: error.message });
    }
};

export const terminateContract = async (req: Request, res: Response) => {
    const requiredFields = ["contract_id"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ Error: `Missing parameter(s): ${missingFields.join(", ")}` });
    }

    try {
        const senderData = req.body;
        const response = await tendersService.terminateContract(senderData);
        return res.status(200).json(response);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ Error: error.message });
        }
        else if (error instanceof BadRequestError) {
            return res.status(400).json({ Error: error.message });
        }
        return res.status(500).json({ Error: error.message });
    }
};

export const doneContract = async (req: Request, res: Response) => {
    const requiredFields = ["contract_id"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ Error: `Missing parameter(s): ${missingFields.join(", ")}` });
    }

    try {
        const senderData = req.body;
        const response = await tendersService.doneContract(senderData);
        return res.status(200).json(response);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ Error: error.message });
        }
        else if (error instanceof BadRequestError) {
            return res.status(400).json({ Error: error.message });
        }
        return res.status(500).json({ Error: error.message });
    }
};

export const didMakeTender = async (req: Request, res: Response) => {
    const companyName = req.query["companyname"] as string;
    const ticketId = req.query["ticket_id"] as string;
    if (!ticketId || !companyName) {
        return res.status(400).json({ Error: "Missing parameter(s): ticket_id and/or companyname" });
    }

    try {
        const response = await tendersService.didMakeTender(companyName, ticketId);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ Error: error.message });
        }
        else if (error instanceof BadRequestError) {
            return res.status(400).json({ Error: error.message });
        }
        return res.status(500).json({ Error: error.message });
    }
};

export const getCompanyTenders = async (req: Request, res: Response) => {
    const companyName = req.query["name"] as string;
    if (!companyName) {
        return res.status(400).json({ Error: "Missing parameter: name" });
    }

    try {
        const response = await tendersService.getCompanyTenders(companyName, req.originalUrl);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ Error: error.message });
        }
        else if (error instanceof BadRequestError) {
            return res.status(400).json({ Error: error.message });
        }
        return res.status(500).json({ Error: error.message });
    }
}

export const getMunicipalityTenders = async (req: Request, res: Response) => {
    const municipality = req.query["municipality"] as string;
    if (!municipality) {
        return res.status(400).json({ Error: "Missing parameter: municipality" });
    }

    try {
        const response = await tendersService.getMunicipalityTenders(municipality, req.originalUrl);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ Error: error.message });
        }
        else if (error instanceof BadRequestError) {
            return res.status(400).json({ Error: error.message });
        }
        return res.status(500).json({ Error: error.message });
    }
};

export const getTicketTender = async (req: Request, res: Response) => {
    const ticketId = req.query["ticket"] as string;
    if (!ticketId) {
        return res.status(400).json({ Error: "Missing parameter: ticket" });
    }

    try {
        const response = await tendersService.getTicketTender(ticketId, req.originalUrl);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ Error: error.message });
        }
        else if (error instanceof BadRequestError) {
            return res.status(400).json({ Error: error.message });
        }
        return res.status(500).json({ Error: error.message });
    }
};

export const getContracts = async (req: Request, res: Response) => {
    const tenderId = req.query["tender"] as string;
    if (!tenderId) {
        return res.status(400).json({ Error: "Missing parameter: tender" });
    }

    try {
        const response = await tendersService.getContracts(tenderId, req.originalUrl);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ Error: error.message });
        }
        else if (error instanceof BadRequestError) {
            return res.status(400).json({ Error: error.message });
        }
        return res.status(500).json({ Error: error.message });
    }
};

export const getMuniContract = async (req: Request, res: Response) => {
    const ticketId = req.query["ticket"] as string;
    if (!ticketId) {
        return res.status(400).json({ Error: "Missing parameter: ticket" });
    }

    try {
        const response = await tendersService.getMuniContract(ticketId, req.originalUrl);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ Error: error.message });
        }
        else if (error instanceof BadRequestError) {
            return res.status(400).json({ Error: error.message });
        }
        return res.status(500).json({ Error: error.message });
    }
};

export const getCompanyContracts = async (req: Request, res: Response) => {
    const tenderId = req.query["tender"] as string;
    const companyName = req.query["company"] as string;
    if (!tenderId || !companyName) {
        return res.status(400).json({ Error: "Missing parameter(s): tender and/or company" });
    }

    try {
        const response = await tendersService.getCompanyContracts(tenderId, companyName, req.originalUrl);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ Error: error.message });
        }
        else if (error instanceof BadRequestError) {
            return res.status(400).json({ Error: error.message });
        }
        return res.status(500).json({ Error: error.message });
    }
};

export const getCompanyContractByTicket = async (req: Request, res: Response) => {
    const ticketId = req.query["ticket"] as string;
    const companyName = req.query["company"] as string;
    if (!ticketId || !companyName) {
        return res.status(400).json({ Error: "Missing parameter(s): ticket and/or company" });
    }

    try {
        const response = await tendersService.getCompanyFromTicketContracts(ticketId, companyName, req.originalUrl);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ Error: error.message });
        }
        else if (error instanceof BadRequestError) {
            return res.status(400).json({ Error: error.message });
        }
        return res.status(500).json({ Error: error.message });
    }
};