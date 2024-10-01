import express, { Router } from "express";

import * as searchingController from "../controllers/searching.controller";
import { cacheMiddleware } from "../config/redis.config";

const router: Router = express.Router();


router.get("/issues", cacheMiddleware, searchingController.searchTickets);
router.get("/municipality", cacheMiddleware, searchingController.searchMunicipalities);
router.get("/municipality-tickets", cacheMiddleware, searchingController.searchMunicipalityTickets);
router.get("/service-provider", cacheMiddleware, searchingController.searchServiceProviders);


export default router;