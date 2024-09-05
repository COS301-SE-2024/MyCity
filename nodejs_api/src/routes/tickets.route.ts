import express, { Router } from 'express';

import {getMostUpvoted, getWatchlist, getTicketsInMunicipality} from '../controllers/tickets.controller';

const router: Router = express.Router();

router.get("/getUpvotes", getMostUpvoted);
router.get("/getwatchlist", getWatchlist);
router.get("/getinarea", getTicketsInMunicipality);

export default router;