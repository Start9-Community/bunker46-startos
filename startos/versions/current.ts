import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:1',
  releaseNotes: {
    en_US:
      'Updated Bunker46 to the latest upstream code. Registration now defaults off while first-account setup still works, sessions use an httpOnly refresh cookie, authentication and NIP-46 permissions are hardened, and upstream Prisma migrations now run on startup. Existing users may need to sign in again after the update. Upstream changes: https://github.com/dsbaars/bunker46/compare/ad869f82ad07f13f99be5c434e8ae85311d8a533...387d8a6f7b7d5b44ba5a414ed59e96d0e7dd4d89',
    es_ES:
      'Bunker46 se actualizó al código upstream más reciente. El registro ahora está desactivado por defecto, pero la primera cuenta todavía se puede crear; las sesiones usan una cookie de actualización httpOnly, se refuerzan la autenticación y los permisos NIP-46, y las migraciones Prisma de upstream se ejecutan al iniciar. Es posible que los usuarios existentes deban iniciar sesión de nuevo después de actualizar. Cambios upstream: https://github.com/dsbaars/bunker46/compare/ad869f82ad07f13f99be5c434e8ae85311d8a533...387d8a6f7b7d5b44ba5a414ed59e96d0e7dd4d89',
    de_DE:
      'Bunker46 wurde auf den neuesten Upstream-Code aktualisiert. Registrierungen sind nun standardmäßig deaktiviert, die Einrichtung des ersten Kontos funktioniert weiterhin, Sitzungen verwenden ein httpOnly-Refresh-Cookie, Authentifizierung und NIP-46-Berechtigungen wurden gehärtet, und Upstream-Prisma-Migrationen laufen nun beim Start. Bestehende Benutzer müssen sich nach dem Update eventuell erneut anmelden. Upstream-Änderungen: https://github.com/dsbaars/bunker46/compare/ad869f82ad07f13f99be5c434e8ae85311d8a533...387d8a6f7b7d5b44ba5a414ed59e96d0e7dd4d89',
    pl_PL:
      'Zaktualizowano Bunker46 do najnowszego kodu upstream. Rejestracja jest teraz domyślnie wyłączona, ale utworzenie pierwszego konta nadal działa; sesje używają ciasteczka odświeżania httpOnly, wzmocniono uwierzytelnianie i uprawnienia NIP-46, a migracje Prisma z upstream uruchamiają się przy starcie. Obecni użytkownicy mogą musieć zalogować się ponownie po aktualizacji. Zmiany upstream: https://github.com/dsbaars/bunker46/compare/ad869f82ad07f13f99be5c434e8ae85311d8a533...387d8a6f7b7d5b44ba5a414ed59e96d0e7dd4d89',
    fr_FR:
      "Bunker46 a été mis à jour avec le dernier code upstream. L'inscription est désormais désactivée par défaut tout en permettant toujours la création du premier compte; les sessions utilisent un cookie de rafraîchissement httpOnly, l'authentification et les autorisations NIP-46 sont renforcées, et les migrations Prisma upstream s'exécutent au démarrage. Les utilisateurs existants devront peut-être se reconnecter après la mise à jour. Changements upstream: https://github.com/dsbaars/bunker46/compare/ad869f82ad07f13f99be5c434e8ae85311d8a533...387d8a6f7b7d5b44ba5a414ed59e96d0e7dd4d89",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
