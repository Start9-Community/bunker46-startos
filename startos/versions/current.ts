import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:10',
  releaseNotes: {
    en_US: 'Includes security updates for the Bunker46 server.',
    es_ES: 'Incluye actualizaciones de seguridad para el servidor de Bunker46.',
    de_DE: 'Enthält Sicherheitsupdates für den Bunker46-Server.',
    pl_PL: 'Zawiera aktualizacje zabezpieczeń serwera Bunker46.',
    fr_FR: 'Inclut des mises à jour de sécurité pour le serveur Bunker46.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
