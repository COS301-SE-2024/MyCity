import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const AWS_REGION = process.env.AWS_REGION;
const cognitoClient = new CognitoIdentityProviderClient({ region: AWS_REGION });
const dynamoDBClient = new DynamoDBClient({ region: AWS_REGION });
const dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoDBClient);

const TICKETS_TABLE = "tickets";
const ASSETS_TABLE = "asset";
const TENDERS_TABLE = "tenders";
const COMPANIES_TABLE = "private_companies";
const MUNICIPALITIES_TABLE = "municipalities";
const WATCHLIST_TABLE = "watchlist";
const TICKET_UPDATE_TABLE = "ticket_updates";
const CONTRACT_TABLE = "contracts";
const UPVOTES_TABLE = "upvotes";
const NOTIFICATIONS_TABLE = "notifications";

export {
    cognitoClient,
    dynamoDBDocumentClient,
    TICKETS_TABLE,
    ASSETS_TABLE,
    TENDERS_TABLE,
    COMPANIES_TABLE,
    MUNICIPALITIES_TABLE,
    WATCHLIST_TABLE,
    TICKET_UPDATE_TABLE,
    CONTRACT_TABLE,
    UPVOTES_TABLE,
    NOTIFICATIONS_TABLE
};