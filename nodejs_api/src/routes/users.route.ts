import express, { Router } from "express";

import * as usersController from "../controllers/users.controller";

const router: Router = express.Router();


router.post("/profile-picture/upload", usersController.uploadProfilePicture);


export default router;