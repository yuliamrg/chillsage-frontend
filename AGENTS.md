# Repository Guidelines

## Scope
This repo is the Angular 17 admin frontend for Chillsage. Keep docs short, operational, and aligned with the codebase. Prefer `README.md` for onboarding, `AGENTS.md` for repo conventions, and `docs/` for durable technical detail.

## Project Structure
- App code lives in `src/`.
- Feature screens live in `src/app/features/`.
- Shared layout lives in `src/app/layout/`.
- API, auth, models, mappers, and shared services live in `src/app/core/`.
- Static assets and vendored AdminLTE files live in `src/assets/`.
- Durable project docs live in `docs/`.

## Commands
- `pnpm install`: install dependencies.
- `pnpm start`: run the dev server on `http://localhost:4200/`.
- `pnpm run build`: create the production build in `dist/angular-example/`.
- `pnpm run watch`: rebuild continuously in development mode.
- `pnpm test`: run Karma in watch mode.
- `pnpm run test:headless`: run Karma once with `ChromeHeadlessCI`.
- `pnpm run browser:install`: install a local Chrome binary for headless tests.

## Editing Conventions
- Follow `.editorconfig`: UTF-8, 2-space indentation, trim trailing whitespace, final newline.
- Use single quotes in TypeScript.
- Keep Angular naming conventional: `feature-name.component.ts`, `*.service.ts`, `*.routes.ts`.
- Prefer standalone components.
- Keep domain models in `src/app/core/models/` and mapping logic in `src/app/core/mappers/`.
- Preserve Spanish for user-facing UI copy unless the surrounding screen is already in another language.

## Validation
- Add or update `*.spec.ts` when changing component behavior, routing, auth, API mapping, or guards.
- Minimum validation for functional changes: `pnpm run test:headless` and `pnpm run build`.
- If a command cannot be run locally, state that explicitly in the handoff.

## Git and PRs
- Do not commit directly to `main`.
- Use short-lived branches such as `feat/requests-form-validation` or `fix/sidebar-navigation-toggle`.
- Follow Conventional Commits with concise imperative subjects.
- PRs should describe the visible change, mention backend contract changes in `../chill-sage-backend`, list validations run, and include screenshots for UI changes.

## Backend Contract
When backend payloads or endpoints change, update the frontend in the same work item:

- source of truth lives in `../chill-sage-backend/docs/contracts/`
- `src/app/core/models/domain.models.ts`
- `src/app/core/mappers/domain.mappers.ts`
- the affected files in `src/app/core/api/` and `src/app/core/auth/`
- related `list`, `detail`, `create`, and `edit` screens
