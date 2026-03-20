# Git Workflow

Este proyecto debe manejarse con un flujo de ramas corto, commits pequeños y validaciones locales antes de integrar cambios. La idea es mantener el historial legible y reducir merge conflicts innecesarios.

## Reglas base

- Nunca trabajar directamente sobre `main`.
- Crear una rama por cambio funcional o técnico.
- Hacer commits pequeños y temáticos.
- No mezclar refactor, fixes y cambios visuales no relacionados en el mismo commit.
- Ejecutar validaciones locales antes de abrir PR o mergear.
- Rebasear o actualizar la rama con frecuencia si `main` avanzó.

## Convención de ramas

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

## Convención de commits

Usar mensajes en estilo Conventional Commits:

- `feat: agrega formulario reactivo de solicitudes`
- `fix: corrige navegacion del sidebar`
- `refactor: simplifica rutas lazy de usuarios`
- `docs: documenta arquitectura y flujo de git`
- `chore: ajusta configuracion de build`

Reglas:

- El título debe explicar el cambio, no el proceso.
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

3. Desarrollar en incrementos pequeños.

4. Revisar cambios antes de commit:

```bash
git status
git diff
```

5. Ejecutar validaciones mínimas del proyecto:

```bash
npm run build
```

Si el cambio afecta comportamiento crítico, además:

```bash
npm test
```

6. Agregar solo los archivos necesarios:

```bash
git add <archivos>
```

7. Crear commit atómico:

```bash
git commit -m "feat: descripcion breve"
```

8. Antes de integrar, actualizar la rama con `main`:

```bash
git fetch origin
git rebase origin/main
```

9. Resolver conflictos, volver a validar y publicar:

```bash
git push -u origin feat/nombre-del-cambio
```

## Qué evitar

- Commits como `cambios`, `fix`, `update`, `prueba`.
- Subir artefactos temporales como logs, screenshots manuales o builds locales.
- Hacer `git add .` sin revisar el diff.
- Resolver conflictos reescribiendo trabajo ajeno sin entenderlo.
- Mezclar cambios de dependencias con cambios funcionales si no son parte del mismo objetivo.

## Checklist antes de merge

- La rama compila con `npm run build`.
- Los archivos versionados son únicamente los necesarios.
- El commit message explica correctamente el cambio.
- La documentación fue actualizada si cambió arquitectura, flujo o setup.
- No quedan logs, capturas ni archivos temporales en staging.

## Política práctica para este repo

Mientras el proyecto siga en etapa de prototipo:

- Priorizar ramas pequeñas y frecuentes.
- Documentar cualquier cambio estructural en `README.md`.
- Si se agrega tooling nuevo, justificarlo en el PR o en la documentación.
- Si un cambio reduce deuda técnica, dejar explícito qué dependencia o comportamiento heredado se eliminó.
