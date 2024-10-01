import { ScanCommand, ScanCommandInput, ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { dynamoDBDocumentClient, WATCHLIST_TABLE } from "../config/dynamodb.config";
import { BadRequestError } from "../types/error.types";
import { JobData } from "../types/job.types";
import { addJobToReadQueue } from "./jobs.service";
import { DB_SCAN } from "../config/redis.config";

export const searchWatchlist = async (searchTerm: string) => {
    searchTerm = validateSearchTerm(searchTerm);
    try {
        const params: ScanCommandInput = {
            TableName: WATCHLIST_TABLE,
            FilterExpression: "contains(user_id, :searchTerm)",
            ExpressionAttributeValues: {
                ":searchTerm": searchTerm
            }
        };
        const jobData: JobData = {
            type: DB_SCAN,
            params: params
        }

        const job = await addJobToReadQueue(jobData);
        const response = await job.finished() as ScanCommandOutput;
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