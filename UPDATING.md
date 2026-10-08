# Updating the upstream version

This package builds [dsbaars/bunker46](https://github.com/dsbaars/bunker46) from the pinned `upstream-project` Git submodule. Upstream currently publishes no GitHub releases, so "latest" means the latest suitable commit on the default branch.

## Determine the latest upstream ref

```sh
git ls-remote https://github.com/dsbaars/bunker46.git refs/heads/main
```

Before changing the pin, verify that the candidate still contains the production Dockerfiles, `pnpm-lock.yaml`, `apps/server/prisma/schema.prisma`, and the web/API workspace packages.

## Apply the bump

1. Run `git submodule update --init`, fetch the upstream submodule, and check out
   the verified commit in `upstream-project`. Both Dockerfiles use that same gitlink.
   Revalidate every carried patch in `patches/README.md`; retire patches only when
   their documented conditions are met.
2. Confirm the upstream workspace version in `upstream-project/package.json`. If it remains
   unchanged, increment the downstream revision in `startos/versions/current.ts`;
   reset it to `:0` when the upstream version changes. The exact source pin lives
   in the submodule gitlink, not in `README.md`.
3. Update all localized release notes in `startos/versions/current.ts`, linking
   the old and new commits. Check for schema migrations and changes to runtime
   requirements, then review `README.md` and `instructions.md` for affected behavior.
4. Run:

```sh
git submodule update --init
npm ci
rm -rf javascript && make javascript/index.js
make
```

If the upstream app changes required environment variables, update `startos/main.ts`, `README.md`, and `instructions.md` together.
