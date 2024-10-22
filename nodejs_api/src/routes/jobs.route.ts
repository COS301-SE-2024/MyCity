import express, { Router } from "express";

import * as jobsController from "../controllers/jobs.controller";

const router: Router = express.Router();

router.get("/job-status/:type/:id", jobsController.getJobStatus);
router.get("/cache/delete-key", jobsController.removeCacheKey);
router.get("/cache/delete-all", jobsController.removeAllCache);

export default router;