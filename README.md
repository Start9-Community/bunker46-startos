<p align="center">
  <img src="icon.svg" alt="Bunker46 Logo" width="21%">
</p>

# Bunker46 on StartOS

> Everything not listed in this document should behave the same as upstream
> Bunker46. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Bunker46](https://github.com/dsbaars/bunker46) is a self-hosted NIP-46 Nostr key manager: it keeps your private keys encrypted on your own server and signs requests for connected Nostr clients, so no app ever holds the key itself. This package runs it with its database and cache as private sidecars, generates every secret it needs, and adds a way back in if you lose your password.

- **Upstream repo:** <https://github.com/dsbaars/bunker46>
- **Wrapper repo:** <https://github.com/Start9-Community/bunker46-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Four images: two upstream datastores, and the application's server and web halves built here from a pinned upstream commit.

| Property      | Value                                                                 |
| ------------- | --------------------------------------------------------------------- |
| Images        | `postgres`, `valkey/valkey`, plus a server and a web image built here |
| Architectures | x86_64, aarch64                                                       |
| Entrypoint    | Each image's own, via `sdk.useEntrypoint()`                           |

| Subcontainer      | Image    | Purpose                                              |
| ----------------- | -------- | ---------------------------------------------------- |
| `bunker46-db`     | `db`     | PostgreSQL — the only subcontainer with a volume     |
| `bunker46-valkey` | `valkey` | The cache, for live dashboard and connection updates |
| `bunker46-server` | `server` | The API — attach here for application logs           |
| `bunker46-web`    | `web`    | Caddy, serving the app and proxying the API          |

**Upstream is fetched at build time by commit, not by tag.** The build clones the pinned reference rather than vendoring it, so what ships is decided by a build argument in the server and web Dockerfiles.

**The server's entrypoint baselines an existing database before starting.** It looks for a `users` table with no matching migration record and, if it finds one, marks the initial migration as already applied. That exists so a database created before the package adopted migrations is not re-migrated over the top of live data — a check on every start, not a one-time step.

The web container is Caddy with a small static configuration: it serves the built app, proxies API paths to the server on loopback, falls back to the app for client-side routes, and sets a fixed set of security headers.

## Volume and Data Layout

Two volumes, and neither is the application's own working directory.

| Volume    | Mount Point           | Purpose                                |
| --------- | --------------------- | -------------------------------------- |
| `db`      | `/var/lib/postgresql` | The PostgreSQL data directory          |
| `startos` | not mounted           | Package state — every generated secret |

**The server and web containers mount nothing.** All persistent state is in PostgreSQL, which means the keys Bunker46 exists to protect live in the database rather than on a filesystem the application writes.

`startos` is deliberately unmounted: it holds the secrets the package generates, and the application receives them as environment rather than as a readable file.

## File Models

One model, and it is the package's whole secret store.

| File         | Format | Modelled                | Written by                   |
| ------------ | ------ | ----------------------- | ---------------------------- |
| `store.json` | JSON   | Yes — `FileHelper.json` | Init, `main`, and one action |

It holds four generated secrets — the database password, two JWT signing secrets, and the application's **encryption key** — plus one setting, whether new-user registration is permitted.

**The encryption key is the one that matters.** It is what the application encrypts stored Nostr keys with, so `store.json` and the database are two halves of one secret: either alone recovers nothing. Both are in the backup, which is what makes a restore work and what makes the backup sensitive.

**Secrets are generated once and then reused.** The seeding routine reads what exists and fills only what is missing, so nothing rotates on its own — and nothing should, because rotating the encryption key would orphan every stored key. It runs on init _and_ from `main`, so a secret deleted by hand is regenerated rather than left empty, but an existing one is never replaced.

The registration setting is read reactively, so toggling it restarts the server with the new value.

Everything else — accounts, keys, NIP-46 connections — is application state in PostgreSQL, which this package does not model.

## Dependencies

None. PostgreSQL and Valkey run as private sidecars of this service rather than as StartOS dependencies.

## Network Access and Interfaces

One interface. Everything else is loopback inside the service.

| Interface | Id   | Type | Port | Description                |
| --------- | ---- | ---- | ---- | -------------------------- |
| Web UI    | `ui` | ui   | 8080 | The Bunker46 web interface |

Bound on the `ui-multi` MultiHost over HTTP and not masked. The API on 3000, PostgreSQL on 5432, and Valkey on 6379 are never exported; PostgreSQL is additionally started with an explicit loopback listen address, so it is unreachable even from elsewhere in the service network.

**The application's origin settings are pinned to loopback**, not to the address the user reaches. That is fine for the API, which is proxied same-origin by Caddy, but it has a consequence for WebAuthn — see [Limitations](#limitations-and-differences).

## Installation and First-Run Flow

Install generates the four secrets and nothing else. There is no task, no wizard, and no credential to record — the user creates their own account in the web interface.

The daemons come up in order: PostgreSQL and Valkey first, then the API server once both are ready, then the web front end. The server is given a generous grace period because its first start runs database migrations.

**Registration is disabled by default**, and that does not block the first account: the application still serves the sign-up screen while no accounts exist. So a fresh install is set up by registering normally, and nobody else can register afterwards unless [Enable Registrations](#actions) is run deliberately.

## Actions

Two actions.

### Enable / Disable Registrations

One action that reads its own name from current state, so it presents as whichever the opposite of the present setting is.

- **What it changes:** the registration flag in the store, which becomes the server's environment on restart.
- **Cost:** the server restarts.
- **Repeat safety:** idempotent — it toggles, so running it twice returns to where you started.
- **When enabled, anyone who can reach the address can create an account.** The action says so in its warning while registration is on. Turn it off once your own account exists.

### Reset Account Password

Generates a new password for an existing account. Run it if you are locked out.

- **When to run it:** only while the service is running — it needs the database.
- **What it changes:** the selected account's password hash, directly in the database.
- **Cost:** seconds; no restart, and other accounts are untouched.
- **Repeat safety:** each run generates a **new** password and invalidates the previous one.
- **Input:** a dropdown of existing accounts, read live from the database. **It fails outright when no account exists yet**, with a message saying to create one in the web interface first — that is the expected response on a fresh install, not a fault.
- **Outputs:** the username and the new password, shown once and never stored.

The new password is hashed by running the **application's own** hashing code in a throwaway container, so the resulting hash validates against the running server rather than merely looking correct.

## Tasks

None. This package raises no tasks, so the service is never held on a prompt and its ordinary controls are always available.

## Health Checks

Four checks, two of them shown.

| Check      | Displayed as    | Method                 | Grace Period |
| ---------- | --------------- | ---------------------- | ------------ |
| `server`   | "API Server"    | Port 3000 is listening | 60s          |
| `web`      | "Web Interface" | Port 8080 is listening | default      |
| `postgres` | — internal      | `pg_isready`           | 30s          |
| `valkey`   | — internal      | A cache ping           | default      |

The API server's 60 seconds covers database migrations on first start, which is when it is slowest.

**PostgreSQL reports `loading` rather than failure while it comes up**, so a slow database start does not restart the service; the cache reports failure outright, since a cache that does not answer a ping is not merely slow.

A service restarting with no failing check displayed is one of the two internal sidecars — the service logs name it.

## Backups and Restore

The database is **dumped**, not copied — `sdk.Backups.withPgDump` — and the `startos` volume is added alongside it.

That distinction matters: the `db` volume's files are never captured. A restore starts PostgreSQL and replays the dump into it, which is what allows the backup to survive a future PostgreSQL image bump instead of being tied to the exact on-disk format it was taken with.

**The backup contains your Nostr private keys, in recoverable form.** The database holds them encrypted, and `startos` holds the key that decrypts them, and the backup holds both. That is what makes a restore work at all — and it means the backup deserves the same care as the keys themselves.

The dump authenticates with the database password from the store, so the two halves are not independent in that direction either: a restore needs both.

## Limitations and Differences

1. **WebAuthn is configured for loopback**, not for the address the service is reached at. Passkeys registered against a real hostname will not match, so treat TOTP as the second factor this package supports.
2. **Registration is off by default**, and stays off unless deliberately enabled. The first account is exempt, so setup is unaffected.
3. **The datastores are private.** PostgreSQL and Valkey are sidecars of this service and cannot be shared with, or substituted by, other services.
4. **Secrets never rotate.** There is deliberately no action to regenerate the encryption key, because doing so would make every stored Nostr key unreadable.
5. **The cache is not persisted** — it runs with saving disabled, so a restart empties it. Nothing durable lives there.
6. **Upstream is pinned by commit**, not by release, so the packaged version is whatever that reference points at.

---

## Quick Reference for AI Consumers

```yaml
package_id: bunker46
image: built from ./Dockerfile.server and ./Dockerfile.web # plus postgres, valkey/valkey
architectures:
  - x86_64
  - aarch64
subcontainers:
  - bunker46-db
  - bunker46-valkey
  - bunker46-server
  - bunker46-web
volumes:
  db: /var/lib/postgresql
  startos: not mounted into any container # holds store.json
file_models:
  - store.json # on the startos volume
startos_managed_env_vars:
  - POSTGRES_USER
  - POSTGRES_PASSWORD
  - POSTGRES_DB
  - NODE_ENV
  - PORT
  - HOST
  - DATABASE_URL
  - JWT_SECRET
  - JWT_EXPIRES_IN
  - JWT_REFRESH_SECRET
  - JWT_REFRESH_EXPIRES_IN
  - ENCRYPTION_KEY
  - CORS_ORIGINS
  - REDIS_URL
  - WEBAUTHN_RP_NAME
  - WEBAUTHN_RP_ID
  - WEBAUTHN_ORIGIN
  - LOG_LEVEL
  - ALLOW_REGISTRATION
  - COOKIE_SECURE
  - TRUST_PROXY
dependencies: []
interfaces:
  ui: { type: ui, port: 8080 } # 3000, 5432 and 6379 are internal only
actions:
  - registrations # toggles; name reflects current state
  - reset-password
tasks: []
health_checks:
  - server # displayed "API Server"
  - web # displayed "Web Interface"
  - postgres # internal
  - valkey # internal
```
