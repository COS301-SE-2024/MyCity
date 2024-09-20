import express, { Router } from "express";

import * as ticketsController from "../controllers/tickets.controller";

const router: Router = express.Router();


// router.post("/create", ticketsController.createTicket);

// add a ticket to watchlist
router.post("/addwatchlist", ticketsController.addWatchlist);

router.post("/accept", ticketsController.acceptTicket);

router.post("/close", ticketsController.closeTicket);

router.get("/view", ticketsController.viewTicketData);

router.get("/fault-types", ticketsController.getFaultTypes);

router.get("/getmytickets", ticketsController.getMyTickets);

// get tickets within a given municipality
router.get("/getinarea", ticketsController.getInArea);

router.get("/getopeninarea", ticketsController.getOpenTicketsInMunicipality);

//get a user's watchlisted tickets
router.get("/getwatchlist", ticketsController.getMyWatchlist);

router.post("/interact", ticketsController.interactTicket);

// get most upvoted tickets
router.get("/getUpvotes", ticketsController.getMostUpvoted);

router.get("/getcompanytickets", ticketsController.getCompanyTickets);

router.get("/getopencompanytickets", ticketsController.getOpenCompanyTickets);

router.post("/add-comment-with-image", ticketsController.addCommentWithImage);

router.post("/add-comment-without-image", ticketsController.addCommentWithoutImage);

router.get("/comments", ticketsController.getTicketComments);

// get geodata of all tickets
router.get("/geodata/all", ticketsController.getGeoData);



export default router;