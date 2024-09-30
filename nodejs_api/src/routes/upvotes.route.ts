import express, { Router } from "express";

import * as upvotesController from "../controllers/upvotes.controller";

const router: Router = express.Router();


router.get("/upvotes", upvotesController.searchUpvotes);


export default router;