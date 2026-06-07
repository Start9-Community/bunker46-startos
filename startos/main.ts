import { i18n } from './i18n'
import { ensureSecrets } from './init/seedFiles'
import { sdk } from './sdk'
import {
  apiPort,
  postgresDatabase,
  postgresPort,
  postgresUser,
  redisPort,
  webPort,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Bunker46'))

  const secrets = await ensureSecrets(effects)
  const databaseUrl = `postgresql://${postgresUser}:${secrets.POSTGRES_PASSWORD}@127.0.0.1:${postgresPort}/${postgresDatabase}`

  const dbSubcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'db' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: 'postgres',
      mountpoint: '/var/lib/postgresql/data',
      readonly: false,
    }),
    'bunker46-db',
  )
  const redisSubcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'redis' },
    null,
    'bunker46-redis',
  )
  const serverSubcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'server' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: '/startos',
      readonly: false,
    }),
    'bunker46-server',
  )
  const webSubcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'web' },
    null,
    'bunker46-web',
  )

  return sdk.Daemons.of(effects)
    .addDaemon('database', {
      subcontainer: dbSubcontainer,
      exec: {
        command: sdk.useEntrypoint(),
        runAsInit: true,
        env: {
          POSTGRES_USER: postgresUser,
          POSTGRES_PASSWORD: secrets.POSTGRES_PASSWORD,
          POSTGRES_DB: postgresDatabase,
        },
      },
      ready: {
        display: i18n('Database'),
        fn: () =>
          sdk.healthCheck.runHealthScript(
            [
              'pg_isready',
              '-h',
              '127.0.0.1',
              '-p',
              String(postgresPort),
              '-U',
              postgresUser,
              '-d',
              postgresDatabase,
            ],
            dbSubcontainer,
            {
              timeout: 10_000,
              message: () => i18n('The database is ready'),
              errorMessage: i18n('The database is not ready'),
            },
          ),
        gracePeriod: 30_000,
      },
      requires: [],
    })
    .addDaemon('redis', {
      subcontainer: redisSubcontainer,
      exec: { command: sdk.useEntrypoint(), runAsInit: true },
      ready: {
        display: i18n('Redis'),
        fn: () =>
          sdk.healthCheck.runHealthScript(
            ['redis-cli', '-h', '127.0.0.1', '-p', String(redisPort), 'ping'],
            redisSubcontainer,
            {
              timeout: 10_000,
              message: () => i18n('Redis is ready'),
              errorMessage: i18n('Redis is not ready'),
            },
          ),
      },
      requires: [],
    })
    .addDaemon('server', {
      subcontainer: serverSubcontainer,
      exec: {
        command: sdk.useEntrypoint(),
        runAsInit: true,
        env: {
          NODE_ENV: 'production',
          PORT: String(apiPort),
          HOST: '0.0.0.0',
          DATABASE_URL: databaseUrl,
          JWT_SECRET: secrets.JWT_SECRET,
          JWT_EXPIRES_IN: '15m',
          JWT_REFRESH_SECRET: secrets.JWT_REFRESH_SECRET,
          JWT_REFRESH_EXPIRES_IN: '7d',
          ENCRYPTION_KEY: secrets.ENCRYPTION_KEY,
          CORS_ORIGINS: `http://localhost:${webPort}`,
          REDIS_URL: `redis://127.0.0.1:${redisPort}`,
          WEBAUTHN_RP_NAME: 'Bunker46',
          WEBAUTHN_RP_ID: 'localhost',
          WEBAUTHN_ORIGIN: `http://localhost:${webPort}`,
          LOG_LEVEL: 'info',
          ALLOW_REGISTRATION: 'true',
          TRUST_PROXY: 'true',
        },
      },
      ready: {
        display: i18n('API Server'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, apiPort, {
            successMessage: i18n('The API server is ready'),
            errorMessage: i18n('The API server is not ready'),
          }),
        gracePeriod: 60_000,
      },
      requires: ['database', 'redis'],
    })
    .addDaemon('web', {
      subcontainer: webSubcontainer,
      exec: { command: sdk.useEntrypoint(), runAsInit: true },
      ready: {
        display: i18n('Web Interface'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, webPort, {
            successMessage: i18n('The web interface is ready'),
            errorMessage: i18n('The web interface is not ready'),
          }),
      },
      requires: ['server'],
    })
})
