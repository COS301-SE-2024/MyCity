import express, { Router } from "express";

import * as giveawayController from "../controllers/giveaway.controller";
import { checkCache } from "../config/redis.config";

const router: Router = express.Router();

router.get("/participant/count", checkCache, giveawayController.getParticipantCount);
router.post("/participant/add", giveawayController.addParticipant);

export default router;