import { test, expect } from '@playwright/test';

test.describe("login", () => {

    test("unauthenticated citizen cannot access dashboard", async ({ page }) => {
        await page.goto("http://localhost:3000/");

        await page.goto("http://localhost:3000/dashboard/citizen");

        expect(page.url()).not.toEqual("http://localhost:3000/dashboard/citizen");
    });



    test("citizen is redirected to dashboard on successful login", async ({ page }) => {
        await page.goto("http://localhost:3000/");

        // click the login link
        await page.getByText("Log In").click();

        // fill in email
        await page.getByLabel("Email").fill("janedoe@example.com");

        // fill in password
        await page.getByLabel("Password").fill("Password@123");

        // click on login button
        await page.getByText("Log In").click();

        // expects page url to not have changed

        expect(page.url()).toEqual("http://localhost:3000/dashboard/citizen");
    });

});