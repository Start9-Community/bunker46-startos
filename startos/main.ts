import { storeJson } from './fileModels/store.json'
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
  const allowRegistration =
    (await storeJson.read((s) => s.allowRegistration).const(effects)) ?? false

  const databaseUrl = `postgresql://${postgresUser}:${secrets.POSTGRES_PASSWORD}@127.0.0.1:${postgresPort}/${postgresDatabase}`

  const dbSubcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'db' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'db',
      subpath: null,
      mountpoint: '/var/lib/postgresql',
      readonly: false,
    }),
    'bunker46-db',
  )
  const valkeySubcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'valkey' },
    null,
    'bunker46-valkey',
  )
  const serverSubcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'server' },
    null,
    'bunker46-server',
  )
  const webSubcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'web' },
    null,
    'bunker46-web',
  )

  return sdk.Daemons.of(effects)
    .addDaemon('postgres', {
      subcontainer: dbSubcontainer,
      exec: {
        command: sdk.useEntrypoint(['-c', 'listen_addresses=127.0.0.1']),
        env: {
          POSTGRES_USER: postgresUser,
          POSTGRES_PASSWORD: secrets.POSTGRES_PASSWORD,
          POSTGRES_DB: postgresDatabase,
        },
      },
      ready: {
        display: null,
        fn: async () => {
          const { exitCode } = await dbSubcontainer.exec([
            'pg_isready',
            '-U',
            postgresUser,
            '-d',
            postgresDatabase,
            '-h',
            '127.0.0.1',
          ])
          return exitCode === 0
            ? { result: 'success', message: null }
            : { result: 'loading', message: null }
        },
        gracePeriod: 30_000,
      },
      requires: [],
    })
    .addDaemon('valkey', {
      subcontainer: valkeySubcontainer,
      exec: {
        command: ['valkey-server', '--save', '', '--appendonly', 'no'],
      },
      ready: {
        display: null,
        fn: async () => {
          const res = await valkeySubcontainer.exec(['valkey-cli', 'ping'])
          return res.stdout.toString().trim() === 'PONG'
            ? { result: 'success', message: null }
            : { result: 'failure', message: res.stdout.toString().trim() }
        },
      },
      requires: [],
    })
    .addDaemon('server', {
      subcontainer: serverSubcontainer,
      exec: {
        command: sdk.useEntrypoint(),
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
          ALLOW_REGISTRATION: String(allowRegistration),
          COOKIE_SECURE: 'false',
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
      requires: ['postgres', 'valkey'],
    })
    .addDaemon('web', {
      subcontainer: webSubcontainer,
      exec: { command: sdk.useEntrypoint() },
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
