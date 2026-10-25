
const { test, expect } = require('@playwright/test');

test('Login page is visible', async ({ page }) => {
  //await page.goto('https://the-internet.herokuapp.com/login');
  await page.goto('https://www.saucedemo.com/');

  await expect(
    page.getByLabel('Username')
  ).toBeVisible();

   // Keep the browser open for 10 seconds
   await page.waitForTimeout(10000);
});
