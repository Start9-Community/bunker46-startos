import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:9',
  releaseNotes: {
    en_US:
      "The bundled Valkey cache accepts connections from Bunker46 alone, and the service's health checks respond faster. Requires StartOS 0.4.2 or newer.",
    es_ES:
      'La caché Valkey incluida solo acepta conexiones de Bunker46, y las comprobaciones de estado del servicio responden más rápido. Requiere StartOS 0.4.2 o posterior.',
    de_DE:
      'Der mitgelieferte Valkey-Cache nimmt nur Verbindungen von Bunker46 an, und die Zustandsprüfungen des Dienstes reagieren schneller. Erfordert StartOS 0.4.2 oder neuer.',
    pl_PL:
      'Dołączona pamięć podręczna Valkey przyjmuje połączenia wyłącznie od Bunker46, a sprawdzanie stanu usługi reaguje szybciej. Wymaga StartOS 0.4.2 lub nowszego.',
    fr_FR:
      "Le cache Valkey intégré n'accepte les connexions que de Bunker46, et les contrôles de santé du service réagissent plus vite. Nécessite StartOS 0.4.2 ou une version ultérieure.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
