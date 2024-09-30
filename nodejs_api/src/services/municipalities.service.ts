import { GetCommandInput, GetCommandOutput, ScanCommandInput, ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { MUNICIPALITIES_TABLE } from "../config/dynamodb.config";
import { addJobToReadQueue } from "./jobs.service";
import { DB_GET, DB_SCAN } from "../config/redis.config";
import { JobData } from "../types/job.types";

export const getAllMunicipalities = async (cacheKey: string) => {
    const params: ScanCommandInput = {
        TableName: MUNICIPALITIES_TABLE,
        ProjectionExpression: "municipality_id"
    }

    const jobData: JobData = {
        type: DB_SCAN,
        params: params,
        cacheKey: cacheKey
    }

    const readJob = await addJobToReadQueue(jobData);
    const response = await readJob.finished() as ScanCommandOutput;
    const municipalities = response.Items || [];
    return municipalities;
};

export const getMunicipalityCoordinates = async (municipality: string, cacheKey: string) => {
    const params: GetCommandInput = {
        TableName: MUNICIPALITIES_TABLE,
        Key: {
            "municipality_id": municipality
        },
        ProjectionExpression: "latitude, longitude"
    };

    const jobData: JobData = {
        type: DB_GET,
        params: params,
        cacheKey: cacheKey
    }

    const readJob = await addJobToReadQueue(jobData);
    const response = await readJob.finished() as GetCommandOutput;
    const coordinates = response.Item || null;
    return coordinates;
};