import { Request, Response } from "express";
import * as usersController from "../../src/controllers/users.controller";
import * as usersService from "../../src/services/users.service";

jest.mock("../../src/services/users.service");