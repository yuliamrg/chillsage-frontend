---
name: chillsage-test-writer
description: Test-writing specialist for the Chillsage Angular frontend. Use when Codex needs to create or update unit tests, routing tests, service/interceptor/guard tests, component behavior tests, or browser-assisted validation for features implemented in this repository. Trigger this skill for work in `src/app/**`, especially after backend contract changes, auth/authorization changes, CRUD behavior changes, or UI flows that need regression coverage.
---

# Chillsage Test Writer

Create tests that match the real stack of this repository: Angular 17 standalone components, Jasmine + Karma for automated specs, and `playwright-cli` only as an optional browser assistant for exploring UI flows.

## Workflow

1. Inspect the changed implementation and the nearest existing spec before writing new tests.
2. Choose the lowest-cost test layer that meaningfully covers the regression:
   - pure mapping or permission logic: plain Jasmine unit tests
   - services, guards, interceptors, routing, standalone components: Angular `TestBed`
   - end-to-end or hard-to-reproduce UI flows: explore with `playwright-cli`, then convert findings into repo-ready tests or a manual validation checklist
3. Add or update the closest `*.spec.ts` file instead of creating scattered test helpers.
4. Assert behavior, not implementation trivia. Prefer observable effects: navigation, rendered actions, request shape, redirects, persisted session, hidden buttons, denied access, and error messages.
5. Run targeted verification first, then run the repo-level validation expected for the change.

## Decision Rules

- Prefer unit or component tests over full browser tests unless the regression truly spans multiple screens or depends on rendered interaction.
- Do not introduce Playwright as a new project dependency unless the user explicitly asks for that setup. If `@playwright/test` is absent, use `playwright-cli` only to inspect flows and derive assertions for Jasmine tests or manual QA notes.
- Keep tests local to the feature under change.
- Keep user-facing assertions in Spanish when the UI is in Spanish.
- When auth changes are involved, cover both allowed and denied paths.

## What To Cover

- Services: request URL, HTTP method, mapped payloads, error branches, auth header behavior when relevant.
- Guards and permission logic: authenticated, unauthenticated, authorized, unauthorized, and redirect targets.
- Interceptors: header injection, login exclusions, `401` cleanup, `403` handling.
- Standalone components: conditional buttons, loading/error states, emitted actions, and route-driven behavior.
- Route files: access rules for list/detail/create/edit screens when permissions differ by action.

## Repo Expectations

- Place specs next to the code they cover.
- Match repo style: 2 spaces, single quotes, focused test names.
- Use small fixtures and inline mocks unless a shared helper clearly reduces duplication.
- Avoid overspecifying AdminLTE markup. Test visible behavior and navigation outcomes.
- After meaningful test changes, run `npm test -- --watch=false --browsers=ChromeHeadless` when possible. Run `npm run build` when the implementation changed too.

## References

- Read `references/angular-testing.md` for repo-specific Angular/Karma patterns, target files, and common provider setups.
- Read `references/playwright-cli-workflow.md` only when a UI flow is easier to inspect in a live browser before deciding what to automate.
