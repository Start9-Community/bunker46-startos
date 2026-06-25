# Bunker46

Bunker46 is a self-hosted NIP-46 Nostr key manager. It stores your nsec keys encrypted on your StartOS server and signs requests for connected Nostr clients without handing those private keys to every app.

## Getting set up

1. Start Bunker46.
2. Open the **Web UI** interface from the StartOS dashboard and register your account on the sign-up screen.
3. Optionally, enable TOTP in the web UI for two-factor authentication.
4. Import or create Nostr keys in the Bunker46 web UI.
5. Create NIP-46 connections and copy the generated `bunker://` or `nostrconnect://` URI into compatible Nostr clients.

## What StartOS manages

- PostgreSQL data is stored in a dedicated service volume.
- Runtime secrets are generated on install and stored in `store.json`. They are backed up alongside the database.
- Valkey (a Redis-compatible cache) is started for Bunker46's live dashboard and connection updates.
- The web interface proxies API requests through the same StartOS interface URL.
- New-user registration is kept closed by default after the first account exists.

## Accounts and registration

New-user registration is **disabled by default**. Bunker46 still shows the sign-up screen while no accounts exist, so you can create the first account during setup. After that, no one else can register unless you enable registrations yourself.

- **Forgot your password?** Run the **Reset Account Password** action, pick your account from the dropdown, and StartOS generates and shows a new password for it. Since passkeys are tied to one web address and may not work across all of your StartOS URLs, this action is your reliable recovery path.
- **Want to let others sign up?** Run the **Registrations** action to enable open sign-ups temporarily (run it again to disable). The change takes effect when the service restarts.

## Backups

Back up Bunker46 from the StartOS backup UI. The backup includes the database (via `pg_dump`) and the generated encryption/JWT secrets. Restoring both is required for stored nsec keys to remain readable.

## Limitations

- Passkeys/WebAuthn may not work on all StartOS interface URLs. A passkey is tied to one exact website address, such as `https://bunker.example.com`. StartOS can expose the same service through several addresses, including a LAN address, a `.local` address, an onion address, and a custom domain. Bunker46 currently expects one fixed passkey address, so a passkey created on one StartOS URL may not work from another StartOS URL. Username/password login, TOTP, and NIP-46 signing do not depend on that passkey setting.
- Keep the Bunker46 service volumes secure. They contain the encrypted key database and the package secrets needed to decrypt it.
