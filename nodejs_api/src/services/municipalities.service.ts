import { GetCommand, GetCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { dynamoDBDocumentClient, MUNICIPALITIES_TABLE } from "../config/dynamodb.config";

export const getAllMunicipalities = async () => {
    const params: ScanCommandInput = {
        TableName: MUNICIPALITIES_TABLE,
        ProjectionExpression: "municipality_id"
    }

    const readCommand = new ScanCommand(params);
    const response = await dynamoDBDocumentClient.send(readCommand);
    const municipalities = response.Items || [];

    // Note that only the name of the municipality is being fetched
    // and results are sorted in ascending order
    const municipalitiesList = municipalities.sort((a, b) => a.municipality_id.localeCompare(b.municipality_id));
    return municipalitiesList;
};

export const getMunicipalityCoordinates = async (municipality: string) => {
    const params: GetCommandInput = {
        TableName: MUNICIPALITIES_TABLE,
        Key: {
            "municipality_id": municipality
        },
        ProjectionExpression: "latitude, longitude"
    };

    const readCommand = new GetCommand(params);
    const response = await dynamoDBDocumentClient.send(readCommand);
    const coordinates = response.Item || null;
    return coordinates;
};