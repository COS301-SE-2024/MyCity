import { test, expect } from '@playwright/test';

test.describe("help menu", () => {

    test("user can access help menu on any page", async ({ page }) => {
        await page.goto("http://localhost:3000/");

        // login
        await page.getByText("Login").click();

        await page.getByLabel("Email").fill("janedoe@example.com");
        await page.getByLabel("Password").fill("Password@123");

        // click on login button
        await page.getByText("Login").click();

        // expects page url to not have changed
        expect(page.url()).toEqual("http://localhost:3000/dashboard/citizen");

        page.getByTestId("open-help-menu").click();


    });

});