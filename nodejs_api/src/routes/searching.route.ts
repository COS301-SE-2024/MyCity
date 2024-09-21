import express, { Router } from "express";

import * as searchingController from "../controllers/searching.controller";

const router: Router = express.Router();


router.get("/issues", searchingController.searchTickets);
router.get("/municipality", searchingController.searchMunicipalities);
router.get("/municipality-tickets", searchingController.searchMunicipalityTickets);
router.get("/service-provider", searchingController.searchServiceProviders);


export default router;