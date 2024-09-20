import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDBDocumentClient, WATCHLIST_TABLE } from "../config/dynamodb.config";
import { BadRequestError } from "../types/error.types";
import { capitaliseUserEmail } from "../utils/tickets.utils";

export const searchWatchlist = async (searchTerm: string) => {
    searchTerm = validateSearchTerm(searchTerm);
    try {
        const response = await dynamoDBDocumentClient.send(new ScanCommand({
            TableName: WATCHLIST_TABLE,
            FilterExpression: "contains(user_id, :searchTerm)",
            ExpressionAttributeValues: {
                ":searchTerm": capitaliseUserEmail(searchTerm)
            }
        }));
        const items = response.Items || [];
        return items;
    } catch (e: any) {
        throw new BadRequestError(`Failed to search service providers: ${e.message}`);
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