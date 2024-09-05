import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
    // origin: "http://localhost:80",
    origin: "*",
    optionsSuccessStatus: 200,
};