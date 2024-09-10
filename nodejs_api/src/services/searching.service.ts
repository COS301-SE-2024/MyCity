import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { COMPANIES_TABLE, dynamoDBClient, MUNICIPALITIES_TABLE, TICKETS_TABLE } from "../config/dynamodb.config";
import { BadRequestError } from "../types/error.types";


export const searchTickets = async (userMunicipality: string, searchTerm: string) => {
    searchTerm = validateSearchTerm(searchTerm);
    try {
        const response = await dynamoDBClient.send(new ScanCommand({ TableName: TICKETS_TABLE }));
        const items = response.Items || [];
        const filteredItems = items.filter(item =>
            item.municipality_id?.S?.toLowerCase().includes(userMunicipality.toLowerCase()) &&
            (item.description?.S?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.asset_id?.S?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        return filteredItems;
    } catch (e: any) {
        throw new BadRequestError(`Failed to search tickets for user area: ${e.message}`);
    }
};

export const searchMunicipalities = async (searchTerm: string) => {
    searchTerm = validateSearchTerm(searchTerm);
    try {
        const response = await dynamoDBClient.send(new ScanCommand({ TableName: MUNICIPALITIES_TABLE }));
        const items = response.Items || [];
        const filteredItems = items.filter(item =>
            item.municipality_id?.S?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return filteredItems;
    } catch (e: any) {
        throw new BadRequestError(`Failed to search municipalities: ${e.message}`);
    }
};

export const searchAltMunicipalityTickets = async (municipalityName: string) => {
    municipalityName = validateSearchTerm(municipalityName); // ensuring that garbage is not passed to the function
    try {
        const response = await dynamoDBClient.send(new ScanCommand({ TableName: TICKETS_TABLE }));
        const items = response.Items || [];
        const filteredItems = items.filter(item =>
            item.municipality_id?.S?.toLowerCase().includes(municipalityName.toLowerCase())
        );
        return filteredItems;
    } catch (e: any) {
        throw new BadRequestError(`Failed to search municipalities' tickets: ${e.message}`);
    }
};

export const searchServiceProviders = async (searchTerm: string) => {
    searchTerm = validateSearchTerm(searchTerm);
    try {
        const response = await dynamoDBClient.send(new ScanCommand({ TableName: COMPANIES_TABLE }));
        const items = response.Items || [];
        const filteredItems = items.filter(item =>
            item.name?.S?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return filteredItems;
    } catch (e: any) {
        throw new BadRequestError(`Failed to search service providers: ${e.message}`);
    }
};




//----- UTILITY FUNCTIONS --------
const validateSearchTerm = (searchTerm: string): string => {
    // Allow only alphanumeric characters and spaces to prevent injection attacks
    if (!/^[a-zA-Z \-]*$/.test(searchTerm)) {
        throw new BadRequestError("Invalid search term");
    }
    return searchTerm;
};

