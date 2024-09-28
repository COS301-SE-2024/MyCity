import * as ticketsService from "../../src/services/tickets.service";

describe("tickets service - getFaultTypes", () => {
    test("should return an array of fault types", async () => {
        const faultTypes = await ticketsService.getFaultTypes();
        // expect the response to be an array of objects of the following shape {asset_id: any; assetIcon: any; multiplier: any;}
        expect(faultTypes).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    asset_id: expect.anything(),
                    assetIcon: expect.anything(),
                    multiplier: expect.anything(),
                }),
            ])
        );
    });
});