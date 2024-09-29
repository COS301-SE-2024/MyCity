import { Request, Response } from "express";
import * as tendersController from "../../src/controllers/tenders.controller";
import * as tendersService from "../../src/services/tenders.service";

jest.mock("../../src/services/tenders.service");