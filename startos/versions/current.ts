import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:3',
  releaseNotes: {
    en_US:
      'Updated Bunker46 to the latest upstream build. The server now survives transient relay crashes and adds a restart policy for improved resilience. See the upstream changes: https://github.com/dsbaars/bunker46/compare/387d8a6f7b7d5b44ba5a414ed59e96d0e7dd4d89...1a9c6c3d36d48e4c48b5ea47347fec29b206cdb3. Also includes internal updates for start-sdk 2.0.',
    es_ES:
      'Se actualizó Bunker46 a la última compilación de origen. El servidor ahora resiste caídas transitorias de los relés y añade una política de reinicio para mayor resiliencia. Consulte los cambios de origen: https://github.com/dsbaars/bunker46/compare/387d8a6f7b7d5b44ba5a414ed59e96d0e7dd4d89...1a9c6c3d36d48e4c48b5ea47347fec29b206cdb3. También incluye actualizaciones internas para start-sdk 2.0.',
    de_DE:
      'Bunker46 wurde auf den neuesten Upstream-Build aktualisiert. Der Server übersteht nun vorübergehende Relay-Abstürze und erhält eine Neustart-Richtlinie für höhere Ausfallsicherheit. Siehe die Upstream-Änderungen: https://github.com/dsbaars/bunker46/compare/387d8a6f7b7d5b44ba5a414ed59e96d0e7dd4d89...1a9c6c3d36d48e4c48b5ea47347fec29b206cdb3. Enthält außerdem interne Aktualisierungen für start-sdk 2.0.',
    pl_PL:
      'Zaktualizowano Bunker46 do najnowszej wersji upstream. Serwer przetrwa teraz przejściowe awarie przekaźników i dodaje politykę restartu dla większej odporności. Zobacz zmiany upstream: https://github.com/dsbaars/bunker46/compare/387d8a6f7b7d5b44ba5a414ed59e96d0e7dd4d89...1a9c6c3d36d48e4c48b5ea47347fec29b206cdb3. Zawiera również wewnętrzne aktualizacje dla start-sdk 2.0.',
    fr_FR:
      'Bunker46 a été mis à jour vers la dernière version amont. Le serveur survit désormais aux pannes transitoires des relais et ajoute une politique de redémarrage pour une meilleure résilience. Voir les changements amont : https://github.com/dsbaars/bunker46/compare/387d8a6f7b7d5b44ba5a414ed59e96d0e7dd4d89...1a9c6c3d36d48e4c48b5ea47347fec29b206cdb3. Inclut également des mises à jour internes pour start-sdk 2.0.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
