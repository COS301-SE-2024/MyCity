import { Request, Response } from "express";
import * as watchlistController from "../../src/controllers/watchlist.controller";
import * as watchlistService from "../../src/services/watchlist.service";

jest.mock("../../src/services/watchlist.service");