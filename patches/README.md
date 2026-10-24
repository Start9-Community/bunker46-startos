# Carried patches

The server build applies these patches to the pinned `upstream-project` submodule
with `git apply --check` followed by `git apply`. Changed context must fail the
build so every upstream update revalidates the fix. The submodule stays unmodified.

## 0001 — survive relay handshake timeouts

When a relay connection times out before its WebSocket handshake completes,
nostr-tools closes the connecting socket. The `ws` library emits an asynchronous
`WebSocket was closed before the connection was established` error, which
Bunker46's process guard otherwise treats as fatal. An installed service with a
stored key then repeatedly restarts instead of letting its relay watchdog retry.

The patch recognizes only that exact error from the nostr-tools connection timer.
Other WebSocket errors and unrelated exceptions remain fatal. It also extends the
upstream process-guard tests, which run during the server image build.

**Retire when:** the pinned upstream handles this relay timeout without terminating
the API server, or nostr-tools no longer emits the uncaught error. Confirm the
handler regression tests and live recovery with an unreachable relay before
removing the patch.
