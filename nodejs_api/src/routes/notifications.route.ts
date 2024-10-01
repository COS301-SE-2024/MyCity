import express, { Router } from "express";

import * as notificationsController from "../controllers/notifications.controller";
import { cacheMiddleware } from "../config/redis.config";

const router: Router = express.Router();


router.post("/insert-tokens", notificationsController.insertNotificationToken);
router.get("/get-tokens", cacheMiddleware, notificationsController.getNotificationTokens);


export default router;