import { QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { CONTRACTS_PER_SERVICE_PROVIDER_TABLE, dynamoDBDocumentClient, TENDERS_PER_SERVICE_PROVIDER_TABLE, TICKETS_PER_MUNICIPALITY_TABLE } from "../config/dynamodb.config";

export const getTicketsPerMunicipality = async (municipalityId: string) => {
    const params: QueryCommandInput = {
        TableName: TICKETS_PER_MUNICIPALITY_TABLE,
        KeyConditionExpression: "municipality_id = :municipality_id",
        ExpressionAttributeValues: {
            ":municipality_id": municipalityId
        },
    }

    const command = new QueryCommand(params);
    const response = await dynamoDBDocumentClient.send(command);
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

    const command = new QueryCommand(params);
    const response = await dynamoDBDocumentClient.send(command);
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

    const command = new QueryCommand(params);
    const response = await dynamoDBDocumentClient.send(command);
    const statistics = response.Items || [];
    return statistics;
};
