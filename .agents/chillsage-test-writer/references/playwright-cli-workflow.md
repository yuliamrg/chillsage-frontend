# Playwright CLI Workflow For UI Flows

Use this reference only when a live browser pass will help clarify selectors, route transitions, or permission-driven UI behavior.

## Purpose

`playwright-cli` is a discovery and validation tool here, not the default automated test runner. The repo does not currently declare `@playwright/test`, so do not assume Playwright specs belong in the codebase unless the user asks for that setup.

## Good Uses

- inspect a new login or auth flow
- verify hidden or disabled actions for each role
- confirm redirects after `401` or denied access
- observe accessible labels and stable locators before writing component assertions

## Basic Flow

1. Start the app if needed.
2. Open the target page with `playwright-cli`.
3. Take a snapshot and inspect semantic locators.
4. Exercise the flow.
5. Translate what you learned into:
   - Jasmine/Karma assertions in the relevant spec, or
   - a concise manual validation note if automation is not practical yet

## Example Commands

```powershell
playwright-cli open http://localhost:4200/login
playwright-cli snapshot
playwright-cli fill e1 "admin@example.com"
playwright-cli fill e2 "secret"
playwright-cli click e3
playwright-cli snapshot
playwright-cli close
```

## Conversion Guidance

- Prefer semantic findings such as button labels, redirects, and visible text.
- Do not copy fragile CSS selectors into Angular tests.
- If the CLI reveals a multistep regression, cover the smallest stable layer that proves it.

## If Playwright Tests Are Explicitly Requested Later

- Check whether `@playwright/test` is installed first.
- If it is not installed, stop and make that dependency decision explicit with the user.
- Keep browser-generated code as a starting point, then add assertions manually.
