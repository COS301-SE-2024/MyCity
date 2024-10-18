import express, { Express, NextFunction, Request, Response } from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import cors from "cors";

import ticketsRouter from "./src/routes/tickets.route";
import municipalitiesRouter from "./src/routes/municipalities.route";
import notificationsRouter from "./src/routes/notifications.route";
import searchingRouter from "./src/routes/searching.route";
import tendersRouter from "./src/routes/tenders.route";
import upvotesRouter from "./src/routes/upvotes.route";
import usersRouter from "./src/routes/users.route";
import watchlistRouter from "./src/routes/watchlist.route";
import analyticsRouter from "./src/routes/analytics.route";
import jobsRouter from "./src/routes/jobs.route";
import giveawayRouter from "./src/routes/giveaway.route";

import { corsOptions } from "./src/config/cors";
import { processReadQueue, processWriteQueue } from "./src/config/redis.config";
import { CustomError } from "./src/errors/CustomError";

dotenv.config();

const app: Express = express();

// start the job processors
processReadQueue();
processWriteQueue();

//middleware
app.use(cors(corsOptions));

app.use("/tickets", ticketsRouter);
app.use("/users", usersRouter);

app.use(express.json());
app.use("/municipality", municipalitiesRouter);
app.use("/notifications", notificationsRouter);
app.use("/search", searchingRouter);
app.use("/tenders", tendersRouter);
app.use("/upvotes", upvotesRouter);
app.use("/watchlist", watchlistRouter);
app.use("/analytics", analyticsRouter);
app.use("/jobs", jobsRouter);
app.use("/giveaway", giveawayRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({
        message: "Not Found",
    });
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof CustomError) {
        return res.status(error.status).json({ message: error.message });
    }

    // default to 500 if no status code is provided
    res.status(error.status || 500).json({
        message: error.message,
    });
});

const handler = serverless(app);

export { handler, app };