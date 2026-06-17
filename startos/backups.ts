import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import { postgresDatabase, postgresUser } from './utils'

export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.withPgDump({
    imageId: 'db',
    dbVolume: 'db',
    mountpoint: '/var/lib/postgresql',
    pgdataPath: '/data',
    database: postgresDatabase,
    user: postgresUser,
    password: async () => {
      const pw = await storeJson.read((s) => s.POSTGRES_PASSWORD).once()
      if (!pw) throw new Error('No POSTGRES_PASSWORD found in store.json')
      return pw
    },
  }).addVolume('startos'),
)
