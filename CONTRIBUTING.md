# Contributing

This repository is a StartOS service package. Read `AGENTS.md`, `TODO.md`, `UPDATING.md`, `README.md`, and `instructions.md` before editing.

## Local Build

Install dependencies and validate the StartOS TypeScript bundle:

```sh
npm ci
npm run check
npm run build
```

Build package artifacts:

```sh
make x86
make arm
```

The package uses the shared StartOS `Makefile`/`s9pk.mk` flow, which runs `start-cli s9pk pack`.

## Updating Upstream

Follow `UPDATING.md`. Keep upstream source pins in the Dockerfiles and keep package metadata in `startos/versions/current.ts`.

If behavior changes for users or future maintainers, update `README.md` and `instructions.md` in the same change.

## Pre-Publish Checks

Before publishing or opening a community PR:

1. Confirm the release tag matches the StartOS tag convention for the package version.
2. Run `npm run check`.
3. Run `npm run build`.
4. Run the available tests, if a test script exists.
5. Run `make x86` and `make arm`.
6. Confirm `README.md` lists all actions, volumes, ports, dependencies, limitations, and StartOS-managed settings.
7. Confirm the service has been installed and started on StartOS, the UI loads, and health checks are green.
