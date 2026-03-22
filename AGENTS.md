# Repository Guidelines

## Project Structure & Module Organization
This repo is an Angular 17 admin frontend. Application code lives in `src/`, with feature screens under `src/app/features/` (`users/`, `requests/`, `orders/`, `equipment/`, `schedule/`, `client/`). Shared layout pieces live in `src/app/layout/`, and reusable API, models, mappers, and services live in `src/app/core/`. Static assets and vendored AdminLTE files live in `src/assets/`. Project notes and workflow docs live in `docs/`.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm start`: run the Angular dev server at `http://localhost:4200/`.
- `npm run build`: create a production build in `dist/angular-example/`.
- `npm run watch`: rebuild continuously with the development configuration.
- `npm test`: run unit tests with Karma and Jasmine.

## Coding Style & Naming Conventions
Follow `.editorconfig`: UTF-8, 2-space indentation, trailing whitespace trimmed, final newline required. Use single quotes in TypeScript. Keep Angular naming conventional: `feature-name.component.ts`, `*.service.ts`, `*.routes.ts`. Prefer standalone components and keep domain types in `src/app/core/models/` with mapping logic in `src/app/core/mappers/`. Match existing UI text style: most user-facing strings are in Spanish.

## Testing Guidelines
Unit tests use Jasmine with Karma. Place specs next to the code they cover as `*.spec.ts`. Current coverage is minimal, so add tests when changing component behavior, routing, or API mapping logic. At minimum, run `npm test` for behavior changes and `npm run build` before opening a PR.

## Commit & Pull Request Guidelines
Use short-lived branches and do not commit directly to `main`. Branch names should follow the documented pattern, for example `feat/requests-form-validation` or `fix/sidebar-navigation-toggle`. Recent history follows Conventional Commits such as `feat: integra CRUDs con capa API` and `fix: improve create form error handling`; keep subjects imperative and under about 72 characters.

PRs should describe the user-visible change, note any contract changes with `../chillsage-backend`, and list the validations run. Include screenshots for UI changes and update `README.md` or `docs/` when architecture, workflow, or setup changes.

## Backend Contract Notes
When backend payloads change, update the frontend in the same work item: `src/app/core/models/domain.models.ts`, `src/app/core/mappers/domain.mappers.ts`, the affected `*.service.ts`, and related create/edit/detail/list screens.
