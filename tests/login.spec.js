const { test, expect } = require('@playwright/test');

// Public demo credentials published on the target page.
const username = 'tomsmith';
const password = 'SuperSecretPassword!';

async function login(page, user, pass) {
  await page.getByLabel('Username', { exact: true }).fill(user);
  await page.getByLabel('Password', { exact: true }).fill(pass);
  await page.getByRole('button', { name: /Login/ }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});

test('shows the login form and masks the password', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Login Page', exact: true })).toBeVisible();
  await expect(page.getByLabel('Username', { exact: true })).toBeEditable();
  const passwordInput = page.getByLabel('Password', { exact: true });
  await expect(passwordInput).toBeEditable();
  await passwordInput.fill(password);
  await expect(passwordInput).toHaveAttribute('type', 'password');
  await expect(page.getByRole('button', { name: /Login/ })).toBeEnabled();
});

test('logs in with valid credentials', async ({ page }) => {
  await login(page, username, password);
  await expect(page).toHaveURL(/\/secure$/);
  await expect(page.getByRole('heading', { name: 'Secure Area', exact: true })).toBeVisible();
  await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
});

for (const scenario of [
  { name: 'invalid username', user: 'invalid-user', pass: password, error: 'Your username is invalid!' },
  { name: 'invalid password', user: username, pass: 'WrongPassword!', error: 'Your password is invalid!' },
  { name: 'empty username', user: '', pass: password, error: 'Your username is invalid!' },
  { name: 'empty password', user: username, pass: '', error: 'Your password is invalid!' },
  { name: 'both fields empty', user: '', pass: '', error: 'Your username is invalid!' },
]) {
  test(`rejects ${scenario.name}`, async ({ page }) => {
    await login(page, scenario.user, scenario.pass);
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator('#flash')).toContainText(scenario.error);
    await expect(page.getByRole('link', { name: 'Logout' })).toHaveCount(0);
    await page.goto('/secure');
    await expect(page).toHaveURL(/\/login$/);
  });
}

test('blocks unauthenticated access to the secure area', async ({ page }) => {
  await page.goto('/secure');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator('#flash')).toContainText('You must login to view the secure area!');
});

test('logout ends the session and blocks secure access', async ({ page }) => {
  await login(page, username, password);
  await expect(page).toHaveURL(/\/secure$/);
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator('#flash')).toContainText('You logged out of the secure area!');
  await page.goto('/secure');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator('#flash')).toContainText('You must login to view the secure area!');
});

