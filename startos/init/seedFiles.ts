import { T } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { getDefaultSecret } from '../utils'

export type Bunker46Secrets = {
  POSTGRES_PASSWORD: string
  JWT_SECRET: string
  JWT_REFRESH_SECRET: string
  ENCRYPTION_KEY: string
}

export async function ensureSecrets(effects: T.Effects): Promise<Bunker46Secrets> {
  const current = await storeJson.read().once()
  const next: Bunker46Secrets = {
    POSTGRES_PASSWORD: current?.POSTGRES_PASSWORD ?? getDefaultSecret(),
    JWT_SECRET: current?.JWT_SECRET ?? getDefaultSecret(),
    JWT_REFRESH_SECRET: current?.JWT_REFRESH_SECRET ?? getDefaultSecret(),
    ENCRYPTION_KEY: current?.ENCRYPTION_KEY ?? getDefaultSecret(),
  }

  await storeJson.merge(effects, next)
  return next
}

export const seedFiles = sdk.setupOnInit(async (effects) => {
  await ensureSecrets(effects)
})
