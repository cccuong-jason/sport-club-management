# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js 15 app-router project. Application routes live under `src/app`, with locale-aware pages in `src/app/[locale]` and authenticated screens under `src/app/[locale]/(main)`. Shared UI lives in `src/components`, grouped by domain such as `landing`, `team`, `funds`, and `ui`. Data models are in `src/models`, server/client helpers in `src/lib`, translations in `src/messages`, and tests in `tests`. Static assets live in `public/`.

## Build, Test, and Development Commands
- `npm run dev`: start the local app with Turbopack at `localhost:3000`.
- `npm run build`: create the production build.
- `npm run start`: run the built app.
- `npm test`: run Jest tests in `tests/*.test.ts`.
- `npm run lint`: intended for linting, but verify the script before relying on it because this repo currently uses `next lint` with Next 15.

## Coding Style & Naming Conventions
Use TypeScript with 2-space indentation and existing import alias patterns like `@/components/...`. Components and React files use PascalCase (`HeroSection.tsx`); utilities, hooks, and server helpers use camelCase or kebab-case (`use-mobile.tsx`, `auth-user.ts`). Prefer existing Tailwind utility patterns and shared primitives in `src/components/ui` over ad hoc markup. Preserve the established split: dark, expressive landing UI and light, functional dashboard UI.

## Testing Guidelines
Jest is configured in `jest.config.cjs` with test files in `tests/` named `*.test.ts`. Add or update tests for non-trivial logic changes in `src/lib` or related modules. For UI work, validate behavior against the running app, not just static code review.

## Commit & Pull Request Guidelines
Recent history uses Conventional Commit style such as `feat:` plus concise summaries. Follow that pattern when possible, for example `feat: add event attendance filters`. PRs should include a short description, linked issue or context, test notes, and screenshots or recordings for visible UI changes.

## Agent-Specific UI/UX Validation
For UI or UX investigation and validation, use the Playwright MCP to inspect the live app, visualize components, verify styling and states, and follow the end-to-end UX flow against the code. Do not rely on code inspection alone when the task is about rendered behavior. If UI validation fails repeatedly, do not loop indefinitely: after 3 to 5 meaningful attempts, stop and ask for clarification so the scope or expected behavior can be narrowed.
