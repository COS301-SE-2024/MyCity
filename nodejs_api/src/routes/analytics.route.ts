import express, { Router } from "express";

import * as analyticsController from "../controllers/analytics.controller";

const router: Router = express.Router();

router.get("/tickets_per_municipality", analyticsController.getTicketsPerMunicipality);
router.get("/contracts_per_service_provider", analyticsController.getContractsPerServiceProvider);
router.get("/tenders_per_service_provider", analyticsController.getTendersPerServiceProvider);

export default router;