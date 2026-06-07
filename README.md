<p align="center">
  <img src="icon.svg" alt="Bunker46 Logo" width="21%">
</p>

# Bunker46 on StartOS

> **Upstream repo and docs:** <https://github.com/dsbaars/bunker46>

Bunker46 is a self-hosted NIP-46 Nostr key management service. It stores nsec keys encrypted on the server and signs requests remotely, so Nostr clients can use delegated signing without receiving the private key.

This package builds Bunker46 from source using the pinned upstream ref in the package Dockerfiles. The package manifest and Dockerfiles are the source of truth for image tags, upstream pins, supported architectures, and StartOS package version metadata.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions](#actions)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Image ID | Source | Purpose |
| --- | --- | --- |
| `db` | PostgreSQL image from the manifest | Database |
| `redis` | Redis image from the manifest | Live-update pub/sub used by upstream |
| `server` | Local Docker build | NestJS/Fastify API built from upstream source |
| `web` | Local Docker build | Vue SPA served by Caddy |

Supported StartOS package architectures are `x86_64` and `aarch64`.

The web container uses `Caddyfile.startos` to proxy `/api` to the API process over the StartOS service network. This replaces upstream Docker Compose service DNS with the StartOS subcontainer network model.

## Volume and Data Layout

| Volume | Path | Purpose |
| --- | --- | --- |
| `main` | `/var/lib/postgresql/data` as subpath `postgres` | PostgreSQL data |
| `main` | `store.json` at volume root | StartOS-managed generated secrets |

`store.json` contains the generated PostgreSQL password, JWT secret, refresh-token secret, and Bunker46 encryption key. These values are backed up with the `main` volume and must remain stable for encrypted nsec data to stay readable.

## Installation and First-Run Flow

1. StartOS initializes the service volume and creates `store.json` if it does not already exist.
2. Stable runtime secrets are generated and preserved across restarts, backups, and restores.
3. PostgreSQL and Redis start first.
4. The API starts after the database and Redis are ready, then runs upstream's Prisma schema sync through the upstream server entrypoint.
5. The web UI starts after the API is listening.
6. The user opens the Web UI, registers the first Bunker46 user, imports or creates Nostr keys, and creates NIP-46 connections.

## Configuration Management

There is no StartOS user-facing config screen yet. Bunker46 settings are managed in the upstream web UI.

StartOS supplies these runtime values to the API container:

| Variable | Source / Value |
| --- | --- |
| `NODE_ENV` | production |
| `PORT` | API port |
| `HOST` | all container interfaces |
| `DATABASE_URL` | generated PostgreSQL password and local database endpoint |
| `JWT_SECRET` | generated and persisted in `store.json` |
| `JWT_EXPIRES_IN` | access-token lifetime |
| `JWT_REFRESH_SECRET` | generated and persisted in `store.json` |
| `JWT_REFRESH_EXPIRES_IN` | refresh-token lifetime |
| `ENCRYPTION_KEY` | generated and persisted in `store.json` |
| `CORS_ORIGINS` | local web interface origin |
| `REDIS_URL` | local Redis endpoint |
| `WEBAUTHN_RP_NAME` | Bunker46 |
| `WEBAUTHN_RP_ID` | localhost |
| `WEBAUTHN_ORIGIN` | local web interface origin |
| `LOG_LEVEL` | info |
| `ALLOW_REGISTRATION` | enabled |
| `TRUST_PROXY` | enabled for StartOS proxy headers |

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose |
| --- | ---: | --- | --- |
| Web UI | 8080 | HTTP | Bunker46 dashboard and API proxy |

Access methods are the standard StartOS interface URLs: LAN IP with unique port, mDNS hostname, Tor onion, or custom domain if configured.

## Actions

None.

## Backups and Restore

The package backs up the `main` volume. This includes PostgreSQL data and `store.json`.

Restore behavior: the volume is restored before the service starts. The package preserves restored secrets rather than regenerating them.

## Health Checks

| Check | Method | Purpose |
| --- | --- | --- |
| Database | `pg_isready` | Confirms PostgreSQL accepts connections |
| Redis | `redis-cli ping` | Confirms Redis responds |
| API Server | Port listening | Confirms the API process is accepting connections |
| Web Interface | Port listening | Confirms the Caddy web UI is accepting connections |

## Dependencies

None.

## Limitations and Differences

1. **No StartOS config screen yet** - registration is enabled by default and managed in the Bunker46 UI.
2. **Passkeys/WebAuthn need a fixed website address** - a passkey is tied to one exact website address, while StartOS can expose the same service through several addresses. Username/password login, TOTP, and NIP-46 signing do not depend on that passkey setting.
3. **Source pin lives in Dockerfiles** - upstream does not publish release tags, so the package Dockerfiles pin a specific upstream ref.

## What Is Unchanged from Upstream

The NIP-46 protocol implementation, user management, key management, relay settings, connection permissions, signing logs, Prisma schema sync, and web UI are built from upstream source without application-code patches.

The package changes only the StartOS runtime wrapper: manifest metadata, image build definitions, daemon ordering, generated runtime secrets, persistent volume layout, interface export, Caddy API proxy target, backups, and documentation.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local build, validation, versioning, and release workflow notes.

## Quick Reference for AI Consumers

```yaml
package_id: bunker46
upstream: https://github.com/dsbaars/bunker46
architectures: [x86_64, aarch64]
images:
  db: manifest dockerTag
  redis: manifest dockerTag
  server: dockerBuild
  web: dockerBuild
volumes:
  main:
    postgres: /var/lib/postgresql/data
    store_json: generated package secrets
ports:
  ui: 8080
  api: 3000
  postgres: 5432
  redis: 6379
actions: none
dependencies: none
startos_managed_env_vars:
  - DATABASE_URL
  - JWT_SECRET
  - JWT_REFRESH_SECRET
  - ENCRYPTION_KEY
  - REDIS_URL
```
