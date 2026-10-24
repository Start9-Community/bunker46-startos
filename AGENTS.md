# AGENTS.md

- Keep `startos-server-entrypoint.sh` ahead of the upstream entrypoint; reversing them replays the initial schema over a pre-migrations database.
- Derive WebAuthn settings from the primary URL when fixing passkeys; widening CORS does not fix relying-party identity.
- Use the upstream argon2 implementation for password resets; a substitute hash can look valid yet fail application verification.
