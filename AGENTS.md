# Development workflow
- Install dependencies with `npm install`.
- Use `npm run lint` before committing.
- Run `npm test` (Jest) to execute unit tests in `src/lib/utils/__tests__`.

# Coding style
- TypeScript everywhere (`.ts` / `.tsx`).
- Follow the path aliases defined in `tsconfig.json`:
  - `@components/*` → `src/components/*`
  - `@lib/*` → `src/lib/*`
  - `@maratypes/*` → `src/maratypes/*`
  - `@hooks/*` → `src/hooks/*`
- Prefer functional React components.
- Keep Prisma models in sync with TypeScript types.

# Adding tests
- Place new tests under `src/lib/utils/__tests__/` or `src/lib/api/__tests__/` and so on. 
- Test helper functions individually (see existing small Jest tests).
- Run `npm test` locally and ensure all suites pass.

# Pull requests
- Provide concise, descriptive PR titles.
- Include a summary of changes and note any new scripts or environment variables.
- Confirm `npm run lint` and `npm test` succeed in the PR body.

# Environment
- Prisma uses `DATABASE_URL` from `.env`; create this file locally with
  your PostgreSQL connection string.
