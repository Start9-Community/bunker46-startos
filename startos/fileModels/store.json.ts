import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z
  .object({
    POSTGRES_PASSWORD: z.string().optional().catch(undefined),
    JWT_SECRET: z.string().optional().catch(undefined),
    JWT_REFRESH_SECRET: z.string().optional().catch(undefined),
    ENCRYPTION_KEY: z.string().optional().catch(undefined),
    allowRegistration: z.boolean().catch(true),
  })
  .strip()

export type StoreJson = z.infer<typeof shape>

export const storeJson = FileHelper.json(
  { base: sdk.volumes.startos, subpath: './store.json' },
  shape,
)
