import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:0',
  releaseNotes: {
    en_US: 'Initial Bunker46 package for StartOS.',
    es_ES: 'Paquete inicial de Bunker46 para StartOS.',
    de_DE: 'Erstes Bunker46-Paket für StartOS.',
    pl_PL: 'Początkowy pakiet Bunker46 dla StartOS.',
    fr_FR: 'Paquet initial de Bunker46 pour StartOS.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
