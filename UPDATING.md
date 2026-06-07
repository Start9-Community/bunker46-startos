# Updating the upstream version

This package builds [dsbaars/bunker46](https://github.com/dsbaars/bunker46) from a pinned Git commit. Upstream currently publishes no GitHub releases, so "latest" means the latest suitable commit on the default branch.

## Determine the latest upstream ref

```sh
git ls-remote https://github.com/dsbaars/bunker46.git refs/heads/main
```

Before changing the pin, verify that the candidate still contains the production Dockerfiles, `pnpm-lock.yaml`, `apps/server/prisma/schema.prisma`, and the web/API workspace packages.

## Apply the bump

1. Update `BUNKER46_REF` in both `Dockerfile.server` and `Dockerfile.web`.
2. Update `upstream_ref` and related prose in `README.md`.
3. Update `startos/versions/current.ts` release notes if the upstream behavior changed.
4. Run:

```sh
npm ci
npm run check
npm run build
make
```

If the upstream app changes required environment variables, update `startos/main.ts`, `README.md`, and `instructions.md` together.
