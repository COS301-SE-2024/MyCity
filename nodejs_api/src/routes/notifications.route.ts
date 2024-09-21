import express, { Router } from "express";

import * as notificationsController from "../controllers/notifications.controller";

const router: Router = express.Router();


router.post("/insert-tokens", notificationsController.insertNotificationToken);
router.get("/get-tokens", notificationsController.getNotificationTokens);


export default router;