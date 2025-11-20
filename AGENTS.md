# Repository Guidelines

## Project Structure & Modules
- `apps/web`: Next.js 14 client with pages, shared lib helpers, and i18n assets.
- `apps/mobile`: Expo/React Native client; uses the same shared UI package.
- `packages/ui` shared components; `packages/auth` Supabase auth helpers; `packages/core` trip APIs built with `tsup`; `packages/config` shared TypeScript configs.
- `supabase/` local stack config, migrations, and seeds; `scripts/seed.ts` cleans demo trips/profiles through the Supabase client.
- `docker-compose.yml` runs the app plus Supabase services; `.env.example` lists required secrets and ports.

## Setup, Build & Development
- Install with `pnpm install` (pnpm 9.x). Turbo handles workspace orchestration.
- Dev servers: `pnpm dev --filter @dale/web` (Next on port 3000); `pnpm dev --filter @dale/mobile` (Expo Metro, forwards to emulator/simulator).
- Builds: `pnpm build` runs Turbo builds for apps/packages; `pnpm --filter @dale/core build` produces library dist with `tsup`.
- Quality: `pnpm lint` runs Next/ESLint across the workspace; `pnpm format` applies Prettier to `ts/tsx/md`.
- Data: start the local stack with `docker compose up` after copying `.env.example` to `.env`; reset demo data with `pnpm tsx scripts/seed.ts`.

## Coding Style & Naming Conventions
- TypeScript-first; shared strict settings live in `packages/config`. Keep exports typed and narrow.
- Format with Prettier defaults (2-space indent, trailing commas). Run format/lint before pushing.
- Components and types use PascalCase; variables/functions use camelCase; keep Supabase schema fields in existing snake_case.
- Favor React function components and colocate styles/assets within feature folders for readability.

## Testing Guidelines
- No automated suites are wired up yet; add targeted `*.test.ts(x)` near the code when changing critical flows (trips, auth, Supabase calls).
- For web UI, prefer React Testing Library + Jest; for shared packages, use Jest with ts-jest and stub network/Supabase calls.
- Note coverage or gaps in the PR description, especially around auth and database mutations.

## Commit & Pull Request Guidelines
- Write short, present-tense subjects (e.g., `feat: add trip search filter`, `fix: guard Supabase envs`); keep commits focused.
- PRs should describe behavior changes, mention which app/package is touched, and link issues/tasks.
- Attach screenshots or recordings for UI changes; call out Supabase migrations/seeds or new env vars.
- Ensure lint/format/build commands have been run or explain exceptions for long-running tasks.
