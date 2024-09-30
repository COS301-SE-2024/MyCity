// import request from "supertest";
// import { app } from "../../app";

// describe("Integration Tests - /tickets", () => {
    
//     describe("GET /tickets/fault-types", () => {
//         test("should return fault types", async () => {
//             const response = await request(app).get("/tickets/fault-types");
//             expect(response.statusCode).toBe(200);
//             expect(response.body).toEqual(
//                 expect.arrayContaining([
//                     expect.objectContaining({
//                         asset_id: expect.anything(),
//                         assetIcon: expect.anything(),
//                         multiplier: expect.anything(),
//                     }),
//                 ])
//             );
//         });
//     });

//     describe("POST /tickets/create", () => {
//         /*test("should create a ticket", async () => {
//             const response = await request(app)
//                 .post("/tickets/create")
//                 .send({
//                     address: "Mbhashe Ward 14, Amathole District Municipality, Mbhashe Local Municipality, Eastern Cape",
//                     asset: "Overgrown Vegetation",
//                     description: "This is a test ticket.",
//                     latitude: "-32.11796745",
//                     longitude: "28.86162504",
//                     state: "Opened",
//                     username: "alice.williams@mimecast.com"
//                 });
//             expect(response.statusCode).toBe(200);
//         });*/
//     });

//     describe("POST /tickets/addwatchlist", () => {
//         test("should add a ticket to watchlist", async () => {

//         });
//     });

//     describe("POST /tickets/accept", () => {
//         test("should accept a ticket", async () => {

//         });
//     });

//     describe("POST /tickets/close", () => {
//         test("should close a ticket", async () => {

//         });
//     });

//     describe("GET /tickets/view", () => {
//         test("should view ticket data", async () => {

//         });
//     });

//     describe("GET /tickets/getmytickets", () => {
//         test("should return my tickets", async () => {

//         });
//     });

//     describe("GET /tickets/getinarea", () => {
//         test("should get tickets within a given municipality", async () => {

//         });
//     });

//     describe("GET /tickets/getopeninarea", () => {
//         test("should get open tickets in a municipality", async () => {

//         });
//     });

//     describe("GET /tickets/getwatchlist", () => {
//         test("should return watchlisted tickets", async () => {

//         });
//     });

//     describe("GET /tickets/getUpvotes", () => {
//         test("should return most upvoted tickets", async () => {

//         });
//     });

//     describe("GET /tickets/getcompanytickets", () => {
//         test("should return company tickets", async () => {

//         });
//     });

//     describe("GET /tickets/getopencompanytickets", () => {
//         test("should return open company tickets", async () => {

//         });
//     });

//     describe("POST /tickets/add-comment-with-image", () => {
//         test("should add comment with image", async () => {

//         });
//     });

//     describe("POST /tickets/add-comment-without-image", () => {
//         test("should add comment without image", async () => {

//         });
//     });

//     describe("GET /tickets/comments", () => {
//         test("should get ticket comments", async () => {

//         });
//     });

//     describe("GET /tickets/geodata/all", () => {
//         test("should get geodata of all tickets", async () => {

//         });
//     });
// });
