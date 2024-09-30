import express, { Router } from "express";

import * as upvotesController from "../controllers/upvotes.controller";
import { cacheMiddleware } from "../config/redis.config";

const router: Router = express.Router();


router.get("/upvotes", cacheMiddleware, upvotesController.searchUpvotes);


export default router;