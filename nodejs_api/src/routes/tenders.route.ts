import express, { Router } from "express";
import * as tendersController from "../controllers/tenders.controller";
import { cacheMiddleware } from "../config/redis.config";

const router: Router = express.Router();

router.get("/didbid", cacheMiddleware, tendersController.didMakeTender);
router.get("/getmytenders", cacheMiddleware, tendersController.getCompanyTenders);
router.get("/getmunitenders", cacheMiddleware, tendersController.getMunicipalityTenders);
router.get("/getmunicipalitytenders", cacheMiddleware, tendersController.getTicketTender);
router.get("/getcontracts", cacheMiddleware, tendersController.getContracts);
router.get("/getmunicontract", cacheMiddleware, tendersController.getMuniContract);
router.get("/getcompanycontracts", cacheMiddleware, tendersController.getCompanyContracts);
router.get("/getcompanycontractbyticket", cacheMiddleware, tendersController.getCompanyContractByTicket);
router.post("/create", tendersController.createTender);
router.post("/in-review", tendersController.inReview);
router.post("/accept", tendersController.acceptTender);
router.post("/reject", tendersController.rejectTender);
router.post("/completed", tendersController.completeContract);
router.post("/terminate", tendersController.terminateContract);
router.post("/done", tendersController.doneContract);

export default router;