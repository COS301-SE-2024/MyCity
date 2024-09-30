import { ScanCommandInput, ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { COMPANIES_TABLE, MUNICIPALITIES_TABLE, TICKETS_TABLE } from "../config/dynamodb.config";
import { BadRequestError } from "../types/error.types";
import { addJobToReadQueue } from "./jobs.service";
import { DB_SCAN } from "../config/redis.config";
import { JobData } from "../types/job.types";

export const searchTickets = async (userMunicipality: string, searchTerm: string, cacheKey: string) => {
    validateSearchTerm(searchTerm);
    try {
        const params: ScanCommandInput = {
            TableName: TICKETS_TABLE
        };


        const jobData: JobData = {
            type: DB_SCAN,
            params: params,
            cacheKey: cacheKey
        }

        const readJob = await addJobToReadQueue(jobData);
        const response = await readJob.finished() as ScanCommandOutput;
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

export const searchMunicipalities = async (searchTerm: string, cacheKey: string) => {
    validateSearchTerm(searchTerm);
    try {
        const params: ScanCommandInput = {
            TableName: MUNICIPALITIES_TABLE
        };

        const jobData: JobData = {
            type: DB_SCAN,
            params: params,
            cacheKey: cacheKey
        }

        const readJob = await addJobToReadQueue(jobData);
        const response = await readJob.finished() as ScanCommandOutput;
        const items = response.Items || [];

        const filteredItems = items.filter(item =>
            item.municipality_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return filteredItems;
    } catch (e: any) {
        throw new BadRequestError(`Failed to search municipalities: ${e.message}`);
    }
};

export const searchAltMunicipalityTickets = async (municipalityName: string, cacheKey: string) => {
    validateSearchTerm(municipalityName); // ensuring that garbage is not passed to the function
    try {
        const params: ScanCommandInput = {
            TableName: TICKETS_TABLE
        };

        const jobData: JobData = {
            type: DB_SCAN,
            params: params,
            cacheKey: cacheKey
        }

        const readJob = await addJobToReadQueue(jobData);
        const response = await readJob.finished() as ScanCommandOutput;
        const items = response.Items || [];

        const filteredItems = items.filter(item =>
            item.municipality_id.toLowerCase().includes(municipalityName.toLowerCase())
        );
        return filteredItems;
    } catch (e: any) {
        throw new BadRequestError(`Failed to search municipalities' tickets: ${e.message}`);
    }
};

export const searchServiceProviders = async (searchTerm: string, cacheKey: string) => {
    validateSearchTerm(searchTerm);
    try {
        const params: ScanCommandInput = {
            TableName: COMPANIES_TABLE
        };

        const jobData: JobData = {
            type: DB_SCAN,
            params: params,
            cacheKey: cacheKey
        }

        const readJob = await addJobToReadQueue(jobData);
        const response = await readJob.finished() as ScanCommandOutput;
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