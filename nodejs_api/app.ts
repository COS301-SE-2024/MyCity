import express, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import serverless from 'serverless-http';

import dotenv from 'dotenv';

import ticketsRouter from './src/routes/tickets.route';

import cors from "cors";
import { corsOptions } from './src/config/cors';
dotenv.config();

const app: Express = express();

//middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Hello from root!",
    });
});

app.use('/tickets', ticketsRouter);



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