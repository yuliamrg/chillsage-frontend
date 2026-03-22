# Angular Testing In Chillsage Frontend

Use this reference when creating automated tests in this repository.

## Current Stack

- Angular 17 standalone components
- Jasmine + Karma
- Specs colocated next to source files as `*.spec.ts`
- Very low current coverage, so prefer adding focused tests around the files you touch

## Default File Targets

- `src/app/core/auth/*.ts`: unit tests for auth service, guards, permission helpers, interceptor behavior
- `src/app/core/mappers/*.ts`: pure mapping tests
- `src/app/core/services/*.ts`: HTTP contract tests
- `src/app/features/**/**/*.component.ts`: standalone component tests for visible state and actions
- `src/app/features/**/*.routes.ts` and `src/app/app.routes.ts`: route access tests when auth or permissions change

## Preferred Test Shapes

### Pure logic

Use plain Jasmine without overbuilding Angular fixtures for:

- role-to-permission resolution
- mappers
- small helper functions

### Service, guard, interceptor, and route behavior

Use `TestBed` and provide only what the unit needs. Typical building blocks:

- `provideRouter([])` for routing dependencies
- `provideHttpClient(...)` plus `provideHttpClientTesting()` for HTTP behavior
- spies for router navigation and storage-facing services

For auth-related work, verify both success and failure branches:

- login persists session correctly
- logout clears session
- `401` clears session and redirects
- `403` redirects or blocks access
- guards allow and deny based on auth state and permission metadata

### Standalone components

Import the component directly in `TestBed.configureTestingModule`.

Focus assertions on:

- whether buttons or sections render based on role
- whether loading, empty, and error states render
- whether component methods bail out when permission is missing
- whether navigation or service calls fire on user action

Avoid brittle assertions on full HTML snapshots.

## Heuristics For This Repo

- If a list screen hides create/edit/delete buttons by role, test one allowed role and one denied role.
- If a route has `data.requiredPermission`, test both the satisfied and unsatisfied cases.
- If a backend contract changed, add tests around the mapper or service boundary before testing a full screen.
- If the implementation uses `localStorage`, isolate reads and writes behind spies or service methods when possible.

## Minimal Verification Commands

Run the narrowest useful command first, then broaden if needed.

```powershell
npm test -- --watch=false --browsers=ChromeHeadless
npm run build
```

If the environment prevents running headless Chrome, explain that clearly and still leave the spec in a runnable state.
