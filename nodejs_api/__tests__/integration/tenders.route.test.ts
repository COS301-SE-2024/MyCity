import request from "supertest";
import { app } from "../../app";
import * as tendersService from "../../src/services/tenders.service";

jest.mock("../../src/services/tenders.service");

describe("Integration Test - /tenders", () => {

    describe("GET /getmytenders", () => {
        test("should return a list of company tenders", async () => {
            const mockResponse = [
                { tender_id: "tender1" },
                { tender_id: "tender2" },
                { tender_id: "tender3" },
            ];
            jest.spyOn(tendersService, "getCompanyTenders").mockResolvedValue(mockResponse);

            const response = await request(app).get("/tenders/getmytenders?name=Xero");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockResponse);
            expect(tendersService.getCompanyTenders).toHaveBeenCalledTimes(1);
        });
    });

    describe("GET /getmunitenders", () => {
        test("should return a list of municipality tenders", async () => {
            const mockResponse = [
                { tender_id: "tender1" },
                { tender_id: "tender2" },
                { tender_id: "tender3" },
            ];
            jest.spyOn(tendersService, "getMunicipalityTenders").mockResolvedValue(mockResponse);

            const response = await request(app).get("/tenders/getmunitenders?municipality=Tshwane");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockResponse);
            expect(tendersService.getMunicipalityTenders).toHaveBeenCalledTimes(1);
        });
    });

    describe("GET /getcontracts", () => {
        test("should return a list of contracts", async () => {
            const mockResponse = [
                { contract_id: "contract1" },
                { contract_id: "contract2" },
                { contract_id: "contract3" },
            ];
            jest.spyOn(tendersService, "getContracts").mockResolvedValue(mockResponse);

            const response = await request(app).get("/tenders/getcontracts?tender=123");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockResponse);
            expect(tendersService.getContracts).toHaveBeenCalledTimes(1);
        });
    });

    describe("GET /getmunicontract", () => {
        test("should return municipality contracts", async () => {
            const mockResponse = {
                contract_id: "contract1",
                municipality_id: "municipality1"
            };
            jest.spyOn(tendersService, "getMuniContract").mockResolvedValue(mockResponse);

            const response = await request(app).get("/tenders/getmunicontract?ticket=123");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockResponse);
            expect(tendersService.getMuniContract).toHaveBeenCalledTimes(1);
        });
    });

    describe("GET /getcompanycontracts", () => {
        test("should return company contracts", async () => {
            const mockResponse = [
                { contract_id: "contract1" },
                { contract_id: "contract2" },
                { contract_id: "contract3" },
            ];
            jest.spyOn(tendersService, "getCompanyContracts").mockResolvedValue(mockResponse);

            const response = await request(app).get("/tenders/getcompanycontracts?tender=123&company=Xero");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockResponse);
            expect(tendersService.getCompanyContracts).toHaveBeenCalledTimes(1);
        });
    });

});
