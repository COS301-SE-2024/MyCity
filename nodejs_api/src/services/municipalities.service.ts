import { GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDBDocumentClient, MUNICIPALITIES_TABLE } from "../config/dynamodb.config";

export const getAllMunicipalities = async () => {
    const response = await dynamoDBDocumentClient.send(new ScanCommand({
        TableName: MUNICIPALITIES_TABLE,
    }));

    const municipalities = response.Items || [];

    // Note that only the name of the municipality is being fetched
    // and results are sorted in ascending order
    const municipalitiesList = municipalities.map((municipality) => ({
        municipality_id: municipality["municipality_id"],
    })).sort((a, b) => a.municipality_id.localeCompare(b.municipality_id));
    return municipalitiesList;
};

export const getMunicipalityCoordinates = async (municipality: string) => {
    const response = await dynamoDBDocumentClient.send(new GetCommand({
        TableName: MUNICIPALITIES_TABLE,
        Key: {
            "municipality_id": municipality
        },
        ProjectionExpression: "latitude, longitude"
    }));

    const coordinates = response.Item || null;
    return coordinates;
};