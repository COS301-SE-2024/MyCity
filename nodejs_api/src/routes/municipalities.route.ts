import express, { Router } from "express";

import * as municipalitiesController from "../controllers/municipalities.controller";
import { checkCache } from "../config/redis.config";

const router: Router = express.Router();

router.get("/municipalities-list", checkCache, municipalitiesController.getAllMunicipalitiesList);
router.get("/coordinates", checkCache, municipalitiesController.getMunicipalityCoordinates);

export default router;