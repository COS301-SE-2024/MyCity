import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { dynamoDBClient, UPVOTES_TABLE } from "../config/dynamodb.config";
import { BadRequestError } from "../types/error.types";


export const searchUpvotes = async (searchTerm: string) => {
    searchTerm = validateSearchTerm(searchTerm);
    try {
        const response = await dynamoDBClient.send(new ScanCommand({ TableName: UPVOTES_TABLE }));
        const items = response.Items || [];
        const filteredItems = items.filter(item =>
            item.user_id?.S?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return filteredItems;
    } catch (e: any) {
        throw new BadRequestError(`Failed to search upvotes: ${e.message}`);
    }
};

//----- UTILITY FUNCTIONS --------
const validateSearchTerm = (searchTerm: string): string => {
    // Allow only alphanumeric characters and spaces to prevent injection attacks
    const regex = /^[a-zA-Z \-]*$/;
    if (!regex.test(searchTerm)) {
        throw new BadRequestError("Invalid search term");
    }
    return searchTerm;
};
