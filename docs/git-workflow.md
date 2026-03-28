# Git Workflow

Este proyecto usa un flujo de ramas corto, commits pequenos y validacion local antes de integrar cambios.

## Regla general

- No desarrollar directamente sobre `main`.
- Crear una rama por cambio funcional o tecnico.
- Hacer commits pequenos y tematicos.
- Ejecutar validaciones locales antes de integrar cambios.

## Convencion de ramas

Usar nombres descriptivos con prefijo:

- `feat/<descripcion-corta>`
- `fix/<descripcion-corta>`
- `refactor/<descripcion-corta>`
- `docs/<descripcion-corta>`
- `chore/<descripcion-corta>`

Ejemplos:

- `feat/requests-form-validation`
- `fix/sidebar-navigation-toggle`
- `docs/project-and-git-workflow`

## Convencion de commits

Usar mensajes en estilo Conventional Commits:

- `feat: agrega formulario reactivo de solicitudes`
- `fix: corrige navegacion del sidebar`
- `refactor: simplifica rutas lazy de usuarios`
- `docs: documenta arquitectura y flujo de git`
- `chore: ajusta configuracion de build`

Reglas:

- El titulo debe explicar el cambio, no el proceso.
- Usar verbo en presente.
- Mantener el asunto idealmente por debajo de 72 caracteres.
- Si el cambio es grande, agregar cuerpo explicando contexto y riesgo.

## Flujo recomendado

1. Actualizar `main` local:

```bash
git checkout main
git pull --ff-only
```

2. Crear rama de trabajo:

```bash
git checkout -b feat/nombre-del-cambio
```

3. Desarrollar en incrementos pequenos.

4. Revisar cambios antes de commit:

```bash
git status
git diff
```

5. Ejecutar validaciones minimas del proyecto:

```bash
pnpm run build
```

Si el cambio afecta comportamiento critico, ademas:

```bash
pnpm run test:headless
```

6. Agregar solo los archivos necesarios:

```bash
git add <archivos>
```

7. Crear commit atomico:

```bash
git commit -m "feat: descripcion breve"
```

8. Integrar cambios a `main`.

## Que evitar

- Commits como `cambios`, `fix`, `update`, `prueba`.
- Subir artefactos temporales como logs, screenshots manuales o builds locales.
- Hacer `git add .` sin revisar el diff.
- Resolver conflictos reescribiendo trabajo ajeno sin entenderlo.
- Mezclar cambios de dependencias con cambios funcionales si no son parte del mismo objetivo.

## Checklist antes de merge

- La rama compila con `pnpm run build`.
- Si hubo cambio funcional, las pruebas relevantes pasan.
- Los archivos versionados son unicamente los necesarios.
- El commit message explica correctamente el cambio.
- La documentacion fue actualizada si cambio arquitectura, flujo o setup.
- No quedan logs, capturas ni archivos temporales en staging.

## Politica practica para este repo

- Priorizar ramas pequenas y frecuentes.
- Documentar onboarding en `README.md` y detalle durable en `docs/`.
- Si se agrega tooling nuevo, justificarlo en el PR o en la documentacion.
- Si cambia el contrato del backend hermano, sincronizar tambien `docs/api-contract.md`.
