const { test, expect } = require('@playwright/test');

const apiUrl = 'https://localhost:3000/api/login';

// Test 1: Valid credentials
test('Valid login returns HTTP 200', async ({ request }) => {
  const response = await request.post(apiUrl, {
    data: {
      username: 'testuser',
      password: 'correct123'
    }
  });

  expect(response.status()).toBe(200);

  const json = await response.json();
  expect(json).toBeTruthy();
});

// Test 2: Invalid credentials
test('Invalid login returns HTTP 401', async ({ request }) => {
  const response = await request.post(apiUrl, {
    data: {
      username: 'testuser',
      password: 'wrong123'
    }
  });

  expect(response.status()).toBe(401);

  const json = await response.json();
  expect(json).toBeTruthy();
});