# Bunker46

Bunker46 is a self-hosted NIP-46 Nostr key manager. It stores your nsec keys encrypted on your StartOS server and signs requests for connected Nostr clients without handing those private keys to every app.

## Getting set up

1. Start Bunker46.
2. Open the **Web UI** interface from the StartOS dashboard.
3. Register your first Bunker46 user.
4. Import or create Nostr keys in the Bunker46 web UI.
5. Create NIP-46 connections and copy the generated `bunker://` or `nostrconnect://` URI into compatible Nostr clients.

## What StartOS manages

- PostgreSQL data is stored in the service volume.
- Runtime secrets are generated on install and stored in `store.json` inside the same volume.
- Redis is started for Bunker46 live dashboard and connection updates.
- The web interface proxies API requests through the same StartOS interface URL.

## Backups

Back up Bunker46 from the StartOS backup UI. The backup includes the database and the generated encryption/JWT secrets. Restoring both is required for stored nsec keys to remain readable.

## Limitations

- New user registration is enabled by default. Manage users from inside Bunker46.
- Passkeys/WebAuthn may not work on all StartOS interface URLs. A passkey is tied to one exact website address, such as `https://bunker.example.com`. StartOS can expose the same service through several addresses, including a LAN address, a `.local` address, an onion address, and a custom domain. Bunker46 currently expects one fixed passkey address, so a passkey created on one StartOS URL may not work from another StartOS URL. Username/password login, TOTP, and NIP-46 signing do not depend on that passkey setting.
- Keep the Bunker46 service volume secure. It contains the encrypted key database and the package secrets needed to decrypt it.
