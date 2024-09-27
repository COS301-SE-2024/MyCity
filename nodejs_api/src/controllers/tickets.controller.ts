import { Request, Response } from "express";
import * as ticketsService from "../services/tickets.service";
import { cacheResponse } from "../config/redis.config";


export const createTicket = async (req: Request, res: Response) => {
    const formData = req.body;
    const file = req.file;

    if (!file || !formData["username"]) {
        return res.status(400).json({ Error: "File or username missing" });
    }

    try {
        const response = await ticketsService.createTicket(formData, file);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const addWatchlist = async (req: Request, res: Response) => {
    try {
        const ticketData = req.body;
        const response = await ticketsService.addWatchlist(ticketData);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const acceptTicket = async (req: Request, res: Response) => {
    try {
        const ticketData = req.body;
        const response = await ticketsService.acceptTicket(ticketData);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const closeTicket = async (req: Request, res: Response) => {
    try {
        const ticketData = req.body;
        const response = await ticketsService.closeTicket(ticketData);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const viewTicketData = async (req: Request, res: Response) => {
    try {
        const ticketId = req.query["ticket_id"] as string;
        if (!ticketId) {
            return res.status(400).json({ error: "Ticket Not Found" });
        }
        const result = await ticketsService.viewTicketData(ticketId);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};


export const getFaultTypes = async (req: Request, res: Response) => {
    try {
        const faultTypes = await ticketsService.getFaultTypes();
        return res.status(200).json(faultTypes);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getMyTickets = async (req: Request, res: Response) => {
    try {
        const username = req.query["username"] as string;
        const response = await ticketsService.getMyTickets(username);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getInArea = async (req: Request, res: Response) => {
    try {
        const municipality = req.query["municipality"] as string;
        const response = await ticketsService.getInMyMunicipality(municipality);

        // if (response && response.length > 0) {
        //     cacheResponse(req, 3600, response); //cache response for 1 hour
        // }
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getOpenTicketsInMunicipality = async (req: Request, res: Response) => {
    try {
        const municipality = req.query["municipality"] as string;
        const response = await ticketsService.getOpenTicketsInMunicipality(municipality);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getMyWatchlist = async (req: Request, res: Response) => {
    try {
        const username = req.query["username"] as string;
        const response = await ticketsService.getWatchlist(username);
        // if (response && response.length > 0) {
        //     cacheResponse(req, 3600, response); //cache response for 1 hour
        // }
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const interactTicket = async (req: Request, res: Response) => {
    try {
        const ticketData = req.body;
        const response = await ticketsService.interactTicket(ticketData);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getMostUpvoted = async (req: Request, res: Response) => {
    try {
        const response = await ticketsService.getMostUpvoted();
        if (response && response.length > 0) {
            cacheResponse(req, 3600, response); //cache response for 1 hour
        }
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};


export const getCompanyTickets = async (req: Request, res: Response) => {
    try {
        const companyName = req.query["company"] as string;
        const response = await ticketsService.getCompanyTickets(companyName);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getOpenCompanyTickets = async (req: Request, res: Response) => {
    try {
        const response = await ticketsService.getOpenCompanyTickets();
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const addCommentWithImage = async (req: Request, res: Response) => {
    try {
        const { comment, ticket_id, image_url, user_id } = req.body;
        if (!comment || !ticket_id || !image_url || !user_id) {
            return res.status(400).json({ error: "Missing required field: comment, ticket_id, image_url, or user_id" });
        }
        const response = await ticketsService.addTicketCommentWithImage(comment, ticket_id, image_url, user_id);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const addCommentWithoutImage = async (req: Request, res: Response) => {
    try {
        const { comment, ticket_id, user_id } = req.body;
        if (!comment || !ticket_id || !user_id) {
            return res.status(400).json({ error: "Missing required field: comment, ticket_id, or user_id" });
        }
        const response = await ticketsService.addTicketCommentWithoutImage(comment, ticket_id, user_id);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};

export const getTicketComments = async (req: Request, res: Response) => {
    try {
        const ticketId = req.headers["X-Ticket-ID"] as string;
        if (!ticketId) {
            return res.status(400).json({ error: "Missing required header: X-Ticket-ID" });
        }
        const response = await ticketsService.getTicketComments(ticketId);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};


export const getGeoData = async (req: Request, res: Response) => {
    try {
        const response = await ticketsService.getGeodataAll();
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ Error: error.message });
    }
};