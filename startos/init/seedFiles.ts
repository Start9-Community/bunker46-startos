import { storeJson, StoreJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { getDefaultSecret } from '../utils'

export type Bunker46Secrets = Required<StoreJson>

export async function ensureSecrets(
  effects: Parameters<typeof storeJson.merge>[0],
) {
  const current = (await storeJson.read().once()) ?? {}
  const next: Bunker46Secrets = {
    POSTGRES_PASSWORD: current.POSTGRES_PASSWORD ?? getDefaultSecret(),
    JWT_SECRET: current.JWT_SECRET ?? getDefaultSecret(),
    JWT_REFRESH_SECRET: current.JWT_REFRESH_SECRET ?? getDefaultSecret(),
    ENCRYPTION_KEY: current.ENCRYPTION_KEY ?? getDefaultSecret(),
  }

  await storeJson.merge(effects, next)
  return next
}

export const seedFiles = sdk.setupOnInit(async (effects) => {
  await ensureSecrets(effects)
})
