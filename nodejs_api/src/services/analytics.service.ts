import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { CONTRACTS_PER_SERVICE_PROVIDER_TABLE, dynamoDBDocumentClient, TENDERS_PER_SERVICE_PROVIDER_TABLE, TICKETS_PER_MUNICIPALITY_TABLE } from "../config/dynamodb.config";

export const getTicketsPerMunicipality = async (municipalityId:string) => {
    const response = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: TICKETS_PER_MUNICIPALITY_TABLE,
        KeyConditionExpression: "municipality_id = :municipality_id",
        ExpressionAttributeValues: {
            ":municipality_id": municipalityId
        },
    }));

    const statistics = response.Items || [];
    return statistics;
};

export const getContractsPerServiceProvider = async (serviceProvider:string) => {
    const response = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: CONTRACTS_PER_SERVICE_PROVIDER_TABLE,
        KeyConditionExpression: "service_provider = :service_provider",
        ExpressionAttributeValues: {
            ":service_provider": serviceProvider
        },
    }));

    const statistics = response.Items || [];
    return statistics;
};

export const getTendersPerServiceProvider = async (serviceProvider:string) => {
    const response = await dynamoDBDocumentClient.send(new QueryCommand({
        TableName: TENDERS_PER_SERVICE_PROVIDER_TABLE,
        KeyConditionExpression: "service_provider = :service_provider",
        ExpressionAttributeValues: {
            ":service_provider": serviceProvider
        },
    }));

    const statistics = response.Items || [];
    return statistics;
};

