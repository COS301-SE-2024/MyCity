import request from "supertest";
import { app } from "../../app"; // Adjust the path as necessary to import your Express app
import fs from "fs";
import path from "path";

describe("Integration Test - /profile-picture", () => {

    describe("POST /upload", () => {
        test("should upload a profile picture", async () => {

        });

        test("should return an error for invalid file type", async () => {

        });
    });

});
