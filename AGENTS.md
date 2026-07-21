# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `bunker46`.** Self-hosted NIP-46 Nostr key manager. Four daemons in `main.ts`: `postgres` (bundled Postgres, subcontainer `bunker46-db`), `valkey` (Redis-compatible cache, `bunker46-valkey`), `server` (the API server, `bunker46-server`), and `web` (the web UI, `bunker46-web`). Exposes a single `ui` interface; no dependents. Secrets (Postgres password, JWT/encryption keys) are generated once and persisted in `store.json`. Postgres is backed up via `Backups.withPgDump`.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach bunker46 -n <name> -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — e.g. `bunker46-server`, `bunker46-db`, `bunker46-web`, `bunker46-valkey`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
