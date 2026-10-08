import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:7',
  releaseNotes: {
    en_US:
      'Updated Bunker46 to upstream commit 36a3386, refreshing the server and web dependencies, including NestJS 12, Prisma, Nostr tools, Valkey connectivity, and WebAuthn. Includes the upstream JWT guard compatibility fix for NestJS 12 and a relay handshake timeout fix that keeps the API server running while its watchdog retries. See upstream changes: https://github.com/dsbaars/bunker46/compare/1a9c6c3d36d48e4c48b5ea47347fec29b206cdb3...36a3386b12b306016a07dfc1a44fbeb1e2be0cb1.',
    es_ES:
      'Bunker46 se actualizó al commit de origen 36a3386, renovando las dependencias del servidor y de la web, incluidas NestJS 12, Prisma, las herramientas Nostr, la conectividad con Valkey y WebAuthn. Incluye la corrección de compatibilidad del guard JWT con NestJS 12 y una corrección de los tiempos de espera del handshake de los relés que mantiene el servidor API activo durante los reintentos. Consulte los cambios de origen: https://github.com/dsbaars/bunker46/compare/1a9c6c3d36d48e4c48b5ea47347fec29b206cdb3...36a3386b12b306016a07dfc1a44fbeb1e2be0cb1.',
    de_DE:
      'Bunker46 wurde auf den Upstream-Commit 36a3386 aktualisiert. Die Server- und Web-Abhängigkeiten wurden erneuert, darunter NestJS 12, Prisma, Nostr-Tools, die Valkey-Anbindung und WebAuthn. Enthält den Upstream-Kompatibilitätsfix für den JWT-Guard unter NestJS 12 sowie einen Fix für Relay-Handshake-Zeitüberschreitungen, der den API-Server während erneuter Verbindungsversuche am Laufen hält. Upstream-Änderungen: https://github.com/dsbaars/bunker46/compare/1a9c6c3d36d48e4c48b5ea47347fec29b206cdb3...36a3386b12b306016a07dfc1a44fbeb1e2be0cb1.',
    pl_PL:
      'Zaktualizowano Bunker46 do commitu upstream 36a3386, odświeżając zależności serwera i aplikacji webowej, w tym NestJS 12, Prisma, narzędzia Nostr, łączność z Valkey i WebAuthn. Zawiera poprawkę zgodności strażnika JWT z NestJS 12 oraz poprawkę limitów czasu uzgadniania połączeń z przekaźnikami, dzięki której serwer API działa podczas ponownych prób połączenia. Zmiany upstream: https://github.com/dsbaars/bunker46/compare/1a9c6c3d36d48e4c48b5ea47347fec29b206cdb3...36a3386b12b306016a07dfc1a44fbeb1e2be0cb1.',
    fr_FR:
      'Bunker46 a été mis à jour vers le commit amont 36a3386, avec une actualisation des dépendances du serveur et de l’interface web, dont NestJS 12, Prisma, les outils Nostr, la connexion à Valkey et WebAuthn. Inclut le correctif de compatibilité du guard JWT avec NestJS 12 et une correction des délais de handshake des relais qui maintient le serveur API actif pendant les nouvelles tentatives de connexion. Changements amont : https://github.com/dsbaars/bunker46/compare/1a9c6c3d36d48e4c48b5ea47347fec29b206cdb3...36a3386b12b306016a07dfc1a44fbeb1e2be0cb1.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
