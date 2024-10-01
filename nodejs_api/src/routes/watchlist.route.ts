import express, { Router } from "express";
import * as watchlistController from "../controllers/watchlist.controller";

const router: Router = express.Router();


router.get("/watchlist", watchlistController.searchWatchlist);


export default router;