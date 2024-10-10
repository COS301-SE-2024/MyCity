import express, { Router } from "express";

import * as searchingController from "../controllers/searching.controller";
import { checkCache } from "../config/redis.config";

const router: Router = express.Router();


router.get("/issues", checkCache, searchingController.searchTickets);
router.get("/municipality", checkCache, searchingController.searchMunicipalities);
router.get("/municipality-tickets", checkCache, searchingController.searchMunicipalityTickets);
router.get("/service-provider", checkCache, searchingController.searchServiceProviders);


export default router;