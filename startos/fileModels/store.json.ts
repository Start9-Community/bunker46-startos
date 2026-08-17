import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z
  .object({
    POSTGRES_PASSWORD: z.string().optional().catch(undefined),
    JWT_SECRET: z.string().optional().catch(undefined),
    JWT_REFRESH_SECRET: z.string().optional().catch(undefined),
    // Never add an action that rotates this: it is what the application
    // encrypts stored Nostr keys with, so a new value makes every stored key
    // unreadable. ensureSecrets only ever fills what is missing.
    ENCRYPTION_KEY: z.string().optional().catch(undefined),
    allowRegistration: z.boolean().catch(false),
  })
  .strip()

export type StoreJson = z.infer<typeof shape>

export const storeJson = FileHelper.json(
  { base: sdk.volumes.startos, subpath: './store.json' },
  shape,
)
