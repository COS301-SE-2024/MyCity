import express, { Router } from "express";

import * as watchlistController from "../controllers/watchlist.controller";
import { cacheMiddleware } from "../config/redis.config";

const router: Router = express.Router();


router.get("/watchlist", cacheMiddleware, watchlistController.searchWatchlist);


export default router;