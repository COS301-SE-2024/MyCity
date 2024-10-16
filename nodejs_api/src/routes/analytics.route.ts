import express, { Router } from "express";

import * as analyticsController from "../controllers/analytics.controller";
import { checkCache } from "../config/redis.config";

const router: Router = express.Router();

router.get("/tickets_per_municipality", checkCache, analyticsController.getTicketsPerMunicipality);
router.get("/contracts_per_service_provider", checkCache, analyticsController.getContractsPerServiceProvider);
router.get("/tenders_per_service_provider", checkCache, analyticsController.getTendersPerServiceProvider);

export default router;