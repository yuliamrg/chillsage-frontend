# Chillsage Frontend UI Context

## Repository facts

- Framework: Angular 17 with standalone components.
- Structure: `src/app/features/` for domain screens, `src/app/layout/` for shell components, `src/app/core/` for models, mappers, API, and services.
- Assets: AdminLTE and related static files are vendored in `src/assets/themes/adminlte/`.
- Language: the UI is predominantly Spanish.
- Formatting: `.editorconfig` enforces UTF-8, 2 spaces, final newline, and trimmed trailing whitespace.

## Design constraints

- Treat the current app as an admin panel, not a marketing site.
- Preserve the shell structure unless the request is explicitly architectural.
- Prefer improving hierarchy, density, spacing, forms, and table readability over adding decorative effects.
- If introducing tokens, keep them easy to map onto existing AdminLTE-based markup.
- Do not add visual systems that require large dependency changes unless requested.

## High-value targets

- `src/styles.css`: global tokens, typography, spacing, resets, cross-app utility styles.
- `src/app/layout/**`: header, sidebar, footer, not-found shell consistency.
- `src/app/features/**`: screen-specific layouts, forms, tables, filters, empty states.

## Suggested output shape

When asked to design or implement UI work, aim to return:

1. A short design direction.
2. The concrete file edits.
3. State coverage: hover, focus, disabled, error, empty, loading if applicable.
4. Responsive notes for mobile and desktop.
5. Accessibility notes, especially contrast and keyboard behavior.

## Token starter

Use this pattern when global consistency is missing:

```css
:root {
  --cs-color-primary: #2f6fed;
  --cs-color-ink: #1f2937;
  --cs-color-muted: #6b7280;
  --cs-color-surface: #ffffff;
  --cs-color-surface-alt: #f5f7fb;
  --cs-color-border: #d7deea;
  --cs-color-success: #1f9d63;
  --cs-color-warning: #c9831a;
  --cs-color-danger: #c94b4b;
  --cs-radius-sm: 6px;
  --cs-radius-md: 12px;
  --cs-shadow-sm: 0 8px 20px rgb(15 23 42 / 0.06);
  --cs-space-1: 4px;
  --cs-space-2: 8px;
  --cs-space-3: 12px;
  --cs-space-4: 16px;
  --cs-space-6: 24px;
}
```

Only add or rename tokens when the change improves reuse.
