import * as ticketsService from "../../src/services/tickets.service";
import { dynamoDBDocumentClient } from "../../src/config/dynamodb.config";
import { uploadFile } from "../../src/config/s3bucket.config";
import WebSocket from "ws";

// Mocking dynamoDBDocumentClient and uploadFile
jest.mock("../../src/config/dynamodb.config");
jest.mock("../../src/config/s3bucket.config");
jest.mock("ws")

describe("tickets service - getFaultTypes", () => {
    test("should return a list of fault types", async () => {
        const assetsMock = [
            { asset_id: "1", assetIcon: "icon1.png", multiplier: 1 },
            { asset_id: "2", assetIcon: "icon2.png", multiplier: 2 },
        ];

        (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce({ Items: assetsMock });

        const faultTypes = await ticketsService.getFaultTypes();

        expect(faultTypes).toEqual([
            { asset_id: "1", assetIcon: "icon1.png", multiplier: 1 },
            { asset_id: "2", assetIcon: "icon2.png", multiplier: 2 },
        ]);
    });

    test("should return an empty array if no assets are found", async () => {
        (dynamoDBDocumentClient.send as jest.Mock).mockResolvedValueOnce({ Items: [] });

        const faultTypes = await ticketsService.getFaultTypes();

        expect(faultTypes).toEqual([]);
    });
});