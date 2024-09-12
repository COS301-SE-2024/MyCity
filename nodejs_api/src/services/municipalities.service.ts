import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { dynamoDBClient, MUNICIPALITIES_TABLE } from "../config/dynamodb.config";
import { formatResponse } from "../utils/tickets.utils";

export const getAllMunicipalities = async () => {
    const response = await dynamoDBClient.send(new ScanCommand({
        TableName: MUNICIPALITIES_TABLE,
    }));
    const municipalities = response.Items || [];

    // Note that only the name of the municipality is being fetched
    const municipalitiesList = municipalities.map(municipality => ({
        municipality_id: municipality.municipality_id.S,
    }));

    return formatResponse(200, municipalitiesList);
};
