import { ScanCommand, ScanCommandInput, ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { dynamoDBDocumentClient, UPVOTES_TABLE } from "../config/dynamodb.config";
import { BadRequestError } from "../types/error.types";
import { JobData } from "../types/job.types";
import { DB_SCAN } from "../config/redis.config";
import { addJobToReadQueue } from "./jobs.service";

export const searchUpvotes = async (searchTerm: string, cacheKey: string) => {
    searchTerm = validateSearchTerm(searchTerm);
    try {
        const params: ScanCommandInput = {
            TableName: UPVOTES_TABLE,
            FilterExpression: "contains(user_id, :searchTerm)",
            ExpressionAttributeValues: {
                ":searchTerm": searchTerm
            }
        };
        const jobData: JobData = {
            type: DB_SCAN,
            params: params,
            cacheKey: `sub/1${cacheKey}`
        }

        const job = await addJobToReadQueue(jobData);
        const response = await job.finished() as ScanCommandOutput;
        const items = response.Items || [];
        return items;
    } catch (e: any) {
        throw new BadRequestError(`Failed to search upvotes: ${e.message}`);
    }
};


//----- INTERNAL UTILITY FUNCTIONS --------
const validateSearchTerm = (searchTerm: string): string => {
    // Allow only alphanumeric characters and spaces to prevent injection attacks
    const regex = /^[a-zA-Z \-]*$/;
    if (!regex.test(searchTerm)) {
        throw new BadRequestError("Invalid search term");
    }
    return searchTerm;
};
