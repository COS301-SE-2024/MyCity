import express, { Router } from "express";

import * as municipalitiesController from "../controllers/municipalities.controller";

const router: Router = express.Router();

router.get("/municipalities-list", municipalitiesController.getAllMunicipalitiesList);

export default router;