import express, { Router } from "express";
import multer from "multer";
import bodyParser from "body-parser";

import * as ticketsController from "../controllers/tickets.controller";
import { cacheMiddleware } from "../config/redis.config";

const router: Router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// create a ticket
router.post("/create", upload.single("file"), ticketsController.createTicket);

router.use(bodyParser.json());

// add a ticket to watchlist
router.post("/addwatchlist", ticketsController.addWatchlist);

router.post("/accept", ticketsController.acceptTicket);

router.post("/close", ticketsController.closeTicket);

router.get("/view", cacheMiddleware, ticketsController.viewTicketData);

router.get("/fault-types", cacheMiddleware, ticketsController.getFaultTypes);

router.get("/getmytickets", cacheMiddleware, ticketsController.getMyTickets);

// get tickets within a given municipality
router.get("/getinarea", cacheMiddleware, ticketsController.getInArea);

router.get("/getopeninarea", cacheMiddleware, ticketsController.getOpenTicketsInMunicipality);

//get a user's watchlisted tickets
router.get("/getwatchlist", cacheMiddleware, ticketsController.getMyWatchlist);

router.post("/interact", ticketsController.interactTicket);

// get most upvoted tickets
router.get("/getUpvotes", cacheMiddleware, ticketsController.getMostUpvoted);

router.get("/getcompanytickets", cacheMiddleware, ticketsController.getCompanyTickets);

router.get("/getopencompanytickets", cacheMiddleware, ticketsController.getOpenCompanyTickets);

router.post("/add-comment-with-image", ticketsController.addCommentWithImage);

router.post("/add-comment-without-image", ticketsController.addCommentWithoutImage);

router.get("/comments", cacheMiddleware, ticketsController.getTicketComments);

// get geodata of all tickets
router.get("/geodata/all", cacheMiddleware, ticketsController.getGeoData);


export default router;