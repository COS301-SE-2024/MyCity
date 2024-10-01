import { Request, Response } from "express";
import * as ticketsService from "../services/tickets.service";
import { cacheResponse, DEFAULT_CACHE_DURATION } from "../config/redis.config";

export const createTicket = async (req: Request, res: Response) => {
    const requiredFields = ["address", "asset", "description", "latitude", "longitude", "state", "username"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ Error: `Missing parameter(s): ${missingFields.join(", ")}` });
    }

    try {
        const formData = req.body;
        const file = req.file;
        const response = await ticketsService.createTicket(formData, file);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const addWatchlist = async (req: Request, res: Response) => {
    const requiredFields = ["username", "ticket_id"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ Error: `Missing parameter(s): ${missingFields.join(", ")}` });
    }

    try {
        const ticketData = req.body;
        const response = await ticketsService.addWatchlist(ticketData);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const acceptTicket = async (req: Request, res: Response) => {
    const requiredFields = ["ticket_id"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ Error: `Missing parameter(s): ${missingFields.join(", ")}` });
    }

    try {
        const ticketData = req.body;
        const response = await ticketsService.acceptTicket(ticketData);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const closeTicket = async (req: Request, res: Response) => {
    const requiredFields = ["ticket_id"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ Error: `Missing parameter(s): ${missingFields.join(", ")}` });
    }

    try {
        const ticketData = req.body;
        const response = await ticketsService.closeTicket(ticketData);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const viewTicketData = async (req: Request, res: Response) => {
    const ticketId = req.query["ticket_id"] as string;
    if (!ticketId) {
        return res.status(400).json({ Error: "Missing parameter: ticket_id" });
    }

    try {
        const response = await ticketsService.viewTicketData(ticketId);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getFaultTypes = async (req: Request, res: Response) => {
    try {
        const response = await ticketsService.getFaultTypes();
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getMyTickets = async (req: Request, res: Response) => {
    const username = req.query["username"] as string;
    if (!username) {
        return res.status(400).json({ Error: "Missing parameter: username" });
    }

    try {
        const response = await ticketsService.getMyTickets(username);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getInArea = async (req: Request, res: Response) => {
    const municipality = req.query["municipality"] as string;
    const lastEvaluatedKeyString = req.query["lastEvaluatedKey"] as string;
    if (!municipality) {
        return res.status(400).json({ Error: "Missing parameter: municipality" });
    }

    try {
        const response = await ticketsService.getInMyMunicipality(municipality, lastEvaluatedKeyString);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getOpenTicketsInMunicipality = async (req: Request, res: Response) => {
    const municipality = req.query["municipality"] as string;
    if (!municipality) {
        return res.status(400).json({ Error: "Missing parameter: municipality" });
    }

    try {
        const response = await ticketsService.getOpenTicketsInMunicipality(municipality);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getMyWatchlist = async (req: Request, res: Response) => {
    const username = req.query["username"] as string;
    const lastEvaluatedKeyString = req.query["lastEvaluatedKey"] as string;
    if (!username) {
        return res.status(400).json({ Error: "Missing parameter: username" });
    }

    try {
        const response = await ticketsService.getWatchlist(username, lastEvaluatedKeyString);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const interactTicket = async (req: Request, res: Response) => {
    const requiredFields = ["type", "ticket_id"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ Error: `Missing parameter(s): ${missingFields.join(", ")}` });
    }

    try {
        const ticketData = req.body;
        const response = await ticketsService.interactTicket(ticketData);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getMostUpvoted = async (req: Request, res: Response) => {
    const lastEvaluatedKeyString = req.query["lastEvaluatedKey"] as string;
    try {
        const response = await ticketsService.getMostUpvoted(lastEvaluatedKeyString);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getCompanyTickets = async (req: Request, res: Response) => {
    const companyName = req.query["company"] as string;
    if (!companyName) {
        return res.status(400).json({ Error: "Missing parameter: company" });
    }

    try {
        const response = await ticketsService.getCompanyTickets(companyName);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getOpenCompanyTickets = async (req: Request, res: Response) => {
    try {
        const response = await ticketsService.getOpenCompanyTickets();
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const addCommentWithImage = async (req: Request, res: Response) => {
    const requiredFields = ["comment", "ticket_id", "image_url", "user_id"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing parameter(s): ${missingFields.join(", ")}` });
    }

    try {
        const { comment, ticket_id, image_url, user_id } = req.body;
        const response = await ticketsService.addTicketCommentWithImage(comment, ticket_id, image_url, user_id);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const addCommentWithoutImage = async (req: Request, res: Response) => {
    const requiredFields = ["comment", "ticket_id", "user_id"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing parameter(s): ${missingFields.join(", ")}` });
    }

    try {
        const { comment, ticket_id, user_id } = req.body;
        const response = await ticketsService.addTicketCommentWithoutImage(comment, ticket_id, user_id);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getTicketComments = async (req: Request, res: Response) => {
    const ticketId = req.headers["X-Ticket-ID"] as string;
    if (!ticketId) {
        return res.status(400).json({ Error: "Missing request header: X-Ticket-ID" });
    }
    try {
        const response = await ticketsService.getTicketComments(ticketId);
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getGeoData = async (req: Request, res: Response) => {
    try {
        const response = await ticketsService.getGeodataAll();
        cacheResponse(req.originalUrl, DEFAULT_CACHE_DURATION, response);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};