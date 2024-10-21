import express, { Router } from "express";
import multer from "multer";

import * as ticketsController from "../controllers/tickets.controller";
import { checkCache } from "../config/redis.config";

const router: Router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/create", upload.single("file"), ticketsController.createTicket);
router.get("/getUpvotes", checkCache, ticketsController.getMostUpvoted);
router.get("/getinarea", checkCache, ticketsController.getInArea);
router.get("/getwatchlist", checkCache, ticketsController.getMyWatchlist);
router.get("/view", checkCache, ticketsController.viewTicketData);
router.get("/fault-types", checkCache, ticketsController.getFaultTypes);
router.get("/getmytickets", checkCache, ticketsController.getMyTickets);
router.get("/getopeninarea", checkCache, ticketsController.getOpenTicketsInMunicipality);
router.get("/getcompanytickets", checkCache, ticketsController.getCompanyTickets);
router.get("/getopencompanytickets", checkCache, ticketsController.getOpenCompanyTickets);
router.get("/comments", checkCache, ticketsController.getTicketComments);
router.get("/geodata/all", checkCache, ticketsController.getGeoData);
router.post("/addwatchlist", ticketsController.addWatchlist);
router.post("/accept", ticketsController.acceptTicket);
router.post("/close", ticketsController.closeTicket);
router.post("/interact", ticketsController.interactTicket);
router.post("/add-comment-with-image", ticketsController.addCommentWithImage);
router.post("/add-comment-without-image", ticketsController.addCommentWithoutImage);


export default router;