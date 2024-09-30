import express, { Router } from "express";

import * as jobsController from "../controllers/jobs.controller";

const router: Router = express.Router();

router.get("/job-status/:type/:id", jobsController.getJobStatus);
router.get("/cache/clear", jobsController.clearCache);
router.get("/cache/clear-all", jobsController.clearCache);

export default router;