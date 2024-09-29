import * as tendersService from "../../src/services/tenders.service";
import { dynamoDBDocumentClient } from "../../src/config/dynamodb.config";
import { uploadFile } from "../../src/config/s3bucket.config";
import WebSocket from "ws";

// Mocking dynamoDBDocumentClient and uploadFile
jest.mock("../../src/config/dynamodb.config");
jest.mock("../../src/config/s3bucket.config");
jest.mock("ws")

describe("create tenders ", () => {
    test("should create a ticket successfully", async () => {
    });

    test("should throw an error if ticket does not exist", async () => {
    });
});