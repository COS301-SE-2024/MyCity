import express, { Router } from "express";
import multer from "multer";

import * as usersController from "../controllers/users.controller";

const router: Router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/profile-picture/upload", upload.single("file"), usersController.uploadProfilePicture);

export default router;