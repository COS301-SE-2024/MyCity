import { QueryCommandInput, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { CONTRACTS_PER_SERVICE_PROVIDER_TABLE, TENDERS_PER_SERVICE_PROVIDER_TABLE, TICKETS_PER_MUNICIPALITY_TABLE } from "../config/dynamodb.config";
import { DB_QUERY } from "../config/redis.config";
import { addJobToReadQueue } from "./jobs.service";
import { JobData } from "../types/job.types";

export const getTicketsPerMunicipality = async (municipalityId: string) => {
    const params: QueryCommandInput = {
        TableName: TICKETS_PER_MUNICIPALITY_TABLE,
        KeyConditionExpression: "municipality_id = :municipality_id",
        ExpressionAttributeValues: {
            ":municipality_id": municipalityId
        },
    }

    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    }

    const readJob = await addJobToReadQueue(jobData);
    const response = await readJob.finished() as QueryCommandOutput;
    const statistics = response.Items || [];
    return statistics;
};
export const getContractsPerServiceProvider = async (serviceProvider: string) => {
    const params: QueryCommandInput = {
        TableName: CONTRACTS_PER_SERVICE_PROVIDER_TABLE,
        KeyConditionExpression: "service_provider = :service_provider",
        ExpressionAttributeValues: {
            ":service_provider": serviceProvider
        },
    }

    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    }

    const readJob = await addJobToReadQueue(jobData);
    const response = await readJob.finished() as QueryCommandOutput;
    const statistics = response.Items || [];
    return statistics;
};

export const getTendersPerServiceProvider = async (serviceProvider: string) => {
    const params: QueryCommandInput = {
        TableName: TENDERS_PER_SERVICE_PROVIDER_TABLE,
        KeyConditionExpression: "service_provider = :service_provider",
        ExpressionAttributeValues: {
            ":service_provider": serviceProvider
        },
    }

    const jobData: JobData = {
        type: DB_QUERY,
        params: params
    }

    const readJob = await addJobToReadQueue(jobData);
    const response = await readJob.finished() as QueryCommandOutput;
    const statistics = response.Items || [];
    return statistics;
};
