import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:8',
  releaseNotes: {
    en_US:
      "Fixes memory use growing while the service runs, and keeps the database password out of the server's process list. Requires StartOS 0.4.1 or later.",
    es_ES:
      'Corrige el aumento del uso de memoria mientras el servicio está en ejecución y evita que la contraseña de la base de datos aparezca en la lista de procesos del servidor. Requiere StartOS 0.4.1 o posterior.',
    de_DE:
      'Behebt den wachsenden Speicherverbrauch während der Dienst läuft und hält das Datenbankpasswort aus der Prozessliste des Servers heraus. Erfordert StartOS 0.4.1 oder neuer.',
    pl_PL:
      'Naprawia rosnące zużycie pamięci podczas działania usługi i usuwa hasło bazy danych z listy procesów serwera. Wymaga StartOS 0.4.1 lub nowszego.',
    fr_FR:
      'Corrige l’augmentation de la consommation de mémoire pendant le fonctionnement du service et retire le mot de passe de la base de données de la liste des processus du serveur. Nécessite StartOS 0.4.1 ou version ultérieure.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
