# TODO

- [ ] **Default registration to off once the upstream first-user bypass lands.**
      Upstream PR [dsbaars/bunker46#9](https://github.com/dsbaars/bunker46/pull/9)
      lets the first account be created through the web UI even when
      `ALLOW_REGISTRATION` is off. Once it merges and `BUNKER46_REF` (both
      Dockerfiles) is bumped to include it:
  - flip `allowRegistration` to default off (`fileModels/store.json.ts`
    `.catch(false)`, `main.ts` `?? false`);
  - drop the "disable open registration" install task from `main.ts` — there is
    no longer an open-registration window to close;
  - update `README.md` and `instructions.md` accordingly.

  The **Reset Account Password** action and the **Registrations** toggle stay as-is.
