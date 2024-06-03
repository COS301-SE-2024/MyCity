import { test, expect } from '@playwright/test';

test("citizen with incorrect credentials must not be able to log in", async ({ page }) => {
    await page.goto("http://localhost:3000/");

    // click the login link
    await page.getByText("Login").click();

    // fill in email
    await page.getByLabel("Email").fill("president@gov.za");

    // fill in password
    await page.getByLabel("Password").fill("password");

    // click on submit
    await page.getByText("Submit").click();

    // expects page url to not have changed
    expect(page.url()).toEqual("http://localhost:3000/login");
});
