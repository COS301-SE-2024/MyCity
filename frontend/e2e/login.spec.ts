import { test, expect } from '@playwright/test';

test("citizen login takes them to dashboard", async ({ page }) => {
    await page.goto("http://localhost:3000/");

    // click the login link
    await page.getByText("Login").click();

    // fill in email
    await page.getByLabel("Email").fill("james@gmail.com");

    // fill in password
    await page.getByLabel("Password").fill("password");

    // click on login button
    await page.getByText("Login").click();

    // expects page url to not have changed
    expect(page.url()).toEqual("http://localhost:3000/dashboard");
});
