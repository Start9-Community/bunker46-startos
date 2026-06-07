import { utils } from '@start9labs/start-sdk'

export const webPort = 8080
export const apiPort = 3000
export const postgresPort = 5432
export const redisPort = 6379

export const postgresUser = 'bunker46'
export const postgresDatabase = 'bunker46'

export function getDefaultSecret(): string {
  return utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 64 })
}
