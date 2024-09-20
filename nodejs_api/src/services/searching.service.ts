import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { COMPANIES_TABLE, dynamoDBDocumentClient, MUNICIPALITIES_TABLE, TICKETS_TABLE } from "../config/dynamodb.config";
import { BadRequestError } from "../types/error.types";
import { capitaliseString } from "../utils/searching.utils";

export const searchTickets = async (userMunicipality: string, searchTerm: string) => {
    // validateSearchTerm(searchTerm);
    // try {
    //     const scanCommand = new ScanCommand({
    //         TableName: TICKETS_TABLE,
    //         FilterExpression: "contains(municipality_id, :userMunicipality) AND (contains(description, :searchTerm) OR contains(asset_id, :searchTerm))",
    //         ExpressionAttributeValues: {
    //             ":userMunicipality": { S: capitaliseString(userMunicipality) },
    //             ":searchTerm": { S: capitaliseString(searchTerm) }
    //         }
    //     });

    //     const response = await dynamoDBDocumentClient.send(scanCommand);
    //     const items = response.Items ? response.Items.map(item => unmarshall(item)) : [];
    //     return items;
    // } catch (e: any) {
    //     throw new BadRequestError(`Failed to search tickets for user area: ${e.message}`);
    // }

    return await searchTicketsFuzzy(userMunicipality, searchTerm);
};

export const searchMunicipalities = async (searchTerm: string) => {
    validateSearchTerm(searchTerm);
    try {
        const scanCommand = new ScanCommand({
            TableName: MUNICIPALITIES_TABLE
        });

        const response = await dynamoDBDocumentClient.send(scanCommand);
        const items = response.Items || [];
        const filteredItems = items.filter(item =>
            item.municipality_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return filteredItems;
    } catch (e: any) {
        throw new BadRequestError(`Failed to search municipalities: ${e.message}`);
    }
};

export const searchAltMunicipalityTickets = async (municipalityName: string) => {
    validateSearchTerm(municipalityName); // ensuring that garbage is not passed to the function
    try {
        const scanCommand = new ScanCommand({
            TableName: TICKETS_TABLE
        });

        const response = await dynamoDBDocumentClient.send(scanCommand);
        const items = response.Items || [];
        const filteredItems = items.filter(item =>
            item.municipality_id.toLowerCase().includes(municipalityName.toLowerCase())
        );
        return filteredItems;
    } catch (e: any) {
        throw new BadRequestError(`Failed to search municipalities' tickets: ${e.message}`);
    }
};

export const searchServiceProviders = async (searchTerm: string) => {
    validateSearchTerm(searchTerm);
    try {
        const scanCommand = new ScanCommand({
            TableName: COMPANIES_TABLE
        });

        const response = await dynamoDBDocumentClient.send(scanCommand);
        const items = response.Items || [];
        const filteredItems = items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return filteredItems;
    } catch (e: any) {
        throw new BadRequestError(`Failed to search service providers: ${e.message}`);
    }
};


//----- INTERNAL UTILITY FUNCTIONS --------
const validateSearchTerm = (searchTerm: string) => {
    // Allow only alphanumeric characters and spaces to prevent injection attacks
    if (!/^[a-zA-Z \-]*$/.test(searchTerm)) {
        throw new BadRequestError("Invalid search term");
    }
};

const searchTicketsFuzzy = async (userMunicipality: string, searchTerm: string) => {
    validateSearchTerm(searchTerm);
    try {
        const scanCommand = new ScanCommand({
            TableName: TICKETS_TABLE
        });

        const response = await dynamoDBDocumentClient.send(scanCommand);
        const items = response.Items || [];
        const filteredItems = items.filter(item =>
            item.municipality_id.toLowerCase().includes(userMunicipality.toLowerCase()) &&
            (item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.asset_id.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        return filteredItems;
    } catch (e: any) {
        throw new BadRequestError(`Failed to search tickets for user area: ${e.message}`);
    }
};
