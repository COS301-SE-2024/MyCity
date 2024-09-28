import express, { Router } from "express";
import * as tendersController from "../controllers/tenders.controller";

const router: Router = express.Router();

router.post("/create", tendersController.createTender);
router.post("/in-review", tendersController.inReview);
router.post("/accept", tendersController.acceptTender);
router.post("/reject", tendersController.rejectTender);
router.post("/completed", tendersController.completeContract);
router.post("/terminate", tendersController.terminateContract);
router.post("/done", tendersController.doneContract);
router.post("/didbid", tendersController.didMakeTender);
router.get("/getmytenders", tendersController.getCompanyTenders);
router.get("/getmunitenders", tendersController.getMunicipalityTenders);
router.get("/getmunicipalitytenders", tendersController.getTicketTender);
router.get("/getcontracts", tendersController.getContracts);
router.get("/getmunicontract", tendersController.getMuniContract);
router.get("/getcompanycontracts", tendersController.getCompanyContracts);
router.get("/getcompanycontractbyticket", tendersController.getCompanyContractByTicket);

export default router;