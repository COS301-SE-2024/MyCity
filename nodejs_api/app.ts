import express, { Express, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import serverless from "serverless-http";

import dotenv from "dotenv";

import ticketsRouter from "./src/routes/tickets.route";
import municipalitiesRouter from "./src/routes/municipalities.route";
import notificationsRouter from "./src/routes/notifications.route";
import searchingRouter from "./src/routes/searching.route";
import tendersRouter from "./src/routes/tenders.route";
import upvotesRouter from "./src/routes/upvotes.route";
import usersRouter from "./src/routes/users.route";
import watchlistRouter from "./src/routes/watchlist.route";

import cors from "cors";
import { corsOptions } from "./src/config/cors";
dotenv.config();

const app: Express = express();

//middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());



app.use("/tickets", ticketsRouter);
app.use("/municipality", municipalitiesRouter);
app.use("/notifications", notificationsRouter);
app.use("/search", searchingRouter);
app.use("/tenders", tendersRouter);
app.use("/upvotes", upvotesRouter);
app.use("/users", usersRouter);
app.use("/watchlist", watchlistRouter);



app.use((req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({
        error: "Something bad happened and the server could not process your request",
    });
});

export const handler = serverless(app);