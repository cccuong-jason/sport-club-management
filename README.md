# sport-club-management

## Unified workflow

This repository now includes a root `Makefile` so the common workflows stay consistent across Windows, macOS, and Linux.
Use GNU Make from Git Bash, WSL, MSYS2, Homebrew, or your system package manager.

### Core commands

```bash
make help
make install
make dev
make verify
```

### Container commands

```bash
make docker-build
make docker-up
make docker-ps
make docker-logs
make docker-down
```

## Container environment behavior

The compose stack now ships with committed defaults in `.env.docker`, so `docker compose up --build` works even when `.env.local` does not exist.

- `.env.docker` provides safe local container defaults for Mongo, app URLs, and a development vote encryption key.
- `.env.local` is optional and overrides those values when present.
- Clerk is optional for container boot. If `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are not set, the app starts in fallback mode and sign-in or sign-up pages show a configuration notice instead of crashing.

## Local auth override

If you want the full authentication flow inside the container or local app, add real Clerk keys to `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```
