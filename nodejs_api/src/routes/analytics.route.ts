import express, { Router } from "express";

import * as analyticsController from "../controllers/analytics.controller";
import { cacheMiddleware } from "../config/redis.config";

const router: Router = express.Router();

router.get("/tickets_per_municipality", cacheMiddleware, analyticsController.getTicketsPerMunicipality);
router.get("/contracts_per_service_provider", cacheMiddleware, analyticsController.getContractsPerServiceProvider);
router.get("/tenders_per_service_provider", cacheMiddleware, analyticsController.getTendersPerServiceProvider);

export default router;