# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **`startos-server-entrypoint.sh` baselines a pre-migrations database and must run before the app's own entrypoint.** It marks the initial migration applied when it finds a `users` table with no matching migration row; without it, an install that predates migrations gets the initial schema replayed over live data.
- **`WEBAUTHN_RP_ID`/`WEBAUTHN_ORIGIN`/`CORS_ORIGINS` are pinned to loopback.** That is correct for the same-origin API proxy but wrong for passkeys, which bind to the address the browser actually used — a real fix means deriving them from the service's primary URL, not widening CORS.
- **Postgres is started with an explicit `listen_addresses=127.0.0.1`.** It shares the service network namespace with the other subcontainers, and nothing else should be able to reach it.
- **`reset-password` hashes with the application's own argon2, in a throwaway `server` container.** `argon2.verify` reads its parameters out of the hash string, so a hash produced any other way may look right and fail to validate. Don't reimplement the hashing here.
