import express, { Router } from "express";
import * as tendersController from "../controllers/tenders.controller";
import { checkCache } from "../config/redis.config";

const router: Router = express.Router();

router.get("/didbid", checkCache, tendersController.didMakeTender);
router.get("/getmytenders", checkCache, tendersController.getCompanyTenders);
router.get("/getmunitenders", checkCache, tendersController.getMunicipalityTenders);
router.get("/getmunicipalitytenders", checkCache, tendersController.getTicketTender);
router.get("/getcontracts", checkCache, tendersController.getContracts);
router.get("/getmunicontract", checkCache, tendersController.getMuniContract);
router.get("/getcompanycontracts", checkCache, tendersController.getCompanyContracts);
router.get("/getcompanycontractbyticket", checkCache, tendersController.getCompanyContractByTicket);
router.post("/create", tendersController.createTender);
router.post("/in-review", tendersController.inReview);
router.post("/accept", tendersController.acceptTender);
router.post("/reject", tendersController.rejectTender);
router.post("/completed", tendersController.completeContract);
router.post("/terminate", tendersController.terminateContract);
router.post("/done", tendersController.doneContract);

export default router;