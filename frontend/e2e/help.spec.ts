import { test, expect } from '@playwright/test';

test.describe("help menu", () => {

    test("user can access help menu on any page", async ({ page }) => {
        await page.goto("http://localhost:3000/");
        await page.waitForTimeout(5000);

        // login
        await page.getByTestId("login-btn").click();

        await page.waitForTimeout(5000);

        await page.getByLabel("Email").fill("janedoe@example.com");
        await page.getByLabel("Password").fill("Password@123");

        await page.waitForTimeout(5000);

        // click on login button
        await page.getByTestId("submit-btn").click();

        await page.waitForURL("http://localhost:3000/dashboard/citizen");

        // await page.waitForTimeout(5000);
        // page.getByTestId("open-help-menu").click();
        // expect(page.getByTestId("help")).toBeVisible();

        // await page.waitForTimeout(5000);
        // page.getByTestId("close-help-menu").click();

        await page.waitForTimeout(5000);

        await page.goto("http://localhost:3000/search/citizen");



        //try search
        page.getByTestId("searchbox").fill("mak");
        page.getByTestId("filter").click();
        await page.waitForTimeout(1000);
        await page.getByText(/Municipality Tickets/).click();
        page.getByTestId("search-btn").click();

        await page.waitForTimeout(10000);

        // page.getByTestId("open-help-menu").click();
        // expect(page.getByTestId("help")).toBeVisible();
        // await page.waitForTimeout(5000);
        // page.getByTestId("close-help-menu").click();

        // await page.waitForTimeout(5000);


        await page.goto("http://localhost:3000/settings/citizen");
        page.getByTestId("open-help-menu").click();
        expect(page.getByTestId("help")).toBeVisible();
        // await page.waitForTimeout(5000);
        // page.getByTestId("close-help-menu").click();

        // await page.waitForTimeout(5000);

    });

});