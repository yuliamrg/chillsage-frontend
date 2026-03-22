---
name: chillsage-ui-designer
description: UI design and frontend styling specialist for the Chillsage Angular application. Use when Codex needs to design, redesign, polish, or implement screens, components, layouts, design tokens, responsive behavior, accessibility improvements, or visual consistency work inside this repository's Angular 17 + AdminLTE frontend.
---

# Chillsage UI Designer

Design interfaces that feel intentional, consistent, and implementation-ready for this repository.

## Workflow

1. Inspect the target feature, its route, and nearby layout components before proposing changes.
2. Reuse the repository's current structure: Angular 17 standalone components, feature folders under `src/app/features/`, shared layout under `src/app/layout/`, and global styles in `src/styles.css`.
3. Preserve AdminLTE compatibility unless the user explicitly asks for a visual departure. Improve hierarchy, spacing, typography, empty states, and form clarity without breaking the existing shell.
4. Define or refine reusable tokens before styling one-off screens. Prefer CSS custom properties for colors, spacing, radius, shadow, and motion when changes affect more than one component.
5. Build accessible states by default: visible focus, keyboard reachability, semantic structure, and WCAG AA contrast.
6. If you change code, verify with `npm run build`. Run `npm test` when interaction or rendering logic changes materially.

## Design Rules

- Keep UI copy in Spanish unless the surrounding screen is already English.
- Use 2-space indentation and single quotes in TypeScript to match the repo.
- Prefer extending existing component CSS over introducing new global utilities without need.
- Avoid visual noise. Use color to clarify status, not to decorate every element.
- Design mobile-first, then confirm tablet and desktop behavior.
- Include loading, empty, error, hover, focus, active, and disabled states when relevant.
- When a screen handles CRUD, make primary actions obvious and destructive actions clearly separated.

## Implementation Guidance

- For app-wide visual changes, start in `src/styles.css`.
- For feature work, edit the component pair/trio directly: `*.component.html`, `*.component.css`, and `*.component.ts` only when behavior must change.
- Keep design tokens and shared patterns aligned with the existing admin shell so sidebar, header, cards, tables, and forms feel related.
- When introducing a new pattern, make it reusable across at least one more feature or document the intended reuse.

## Deliverables

Provide concise handoff notes with:

- visual intent and main UX improvements
- files changed
- responsive behavior
- accessibility considerations
- any reusable tokens or patterns introduced

## References

- Read `references/chillsage-frontend.md` when you need project-specific UI constraints, target files, and a compact delivery checklist.
