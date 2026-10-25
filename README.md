# Playwright login tests

Target: https://the-internet.herokuapp.com/login

Public demo account: `tomsmith` / `SuperSecretPassword!` (published on the login page).

## Run

Install Node.js 20 or newer, open a terminal in this folder, then run:

```sh
npm install
npx playwright install chromium
npm test
```

Use `npm run test:headed` to watch the browser, or `npm run report` to open the HTML report.

The nine tests cover form visibility and password masking, successful login, invalid username/password, empty username/password/both, unauthenticated access, and logout with session invalidation. Empty inputs are checked against the demo's server errors; this page does not use browser required-field validation.

Each test has a fresh browser context. The suite runs with one worker to limit traffic to the public demo. No fixed sleeps or mocked authentication are used. Failed runs retain screenshots and traces. Internet connectivity and demo availability are required.

## Use installed Chrome instead

If the Chromium download is unavailable, use installed Google Chrome (PowerShell):

```powershell
$env:PLAYWRIGHT_CHANNEL = 'chrome'
npm test
```

A pnpm lockfile is included for reproducible installation with `pnpm install --frozen-lockfile`.
