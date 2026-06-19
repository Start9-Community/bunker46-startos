import { T, utils } from '@start9labs/start-sdk'
import { ensureSecrets } from '../init/seedFiles'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { postgresDatabase, postgresUser } from '../utils'

const { InputSpec, Value } = sdk

const sqlEsc = (s: string) => s.replace(/'/g, "''")

async function listUsernames(effects: T.Effects): Promise<string[]> {
  const secrets = await ensureSecrets(effects)
  let usernames: string[] = []
  await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'db' },
    sdk.Mounts.of(),
    'reset-password-list',
    async (sub) => {
      const res = await sub.execFail(
        [
          'psql',
          '-h',
          '127.0.0.1',
          '-U',
          postgresUser,
          '-d',
          postgresDatabase,
          '-tAc',
          'SELECT username FROM users ORDER BY username',
        ],
        { env: { PGPASSWORD: secrets.POSTGRES_PASSWORD } },
      )
      usernames = res.stdout
        .toString()
        .trim()
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    },
  )
  return usernames
}

export const resetPassword = sdk.Action.withInput(
  // id
  'reset-password',

  // metadata
  async ({ effects }) => ({
    name: i18n('Reset Account Password'),
    description: i18n(
      'Generate a new password for an existing account — use this if you are locked out and cannot sign in.',
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),

  // input form — a dropdown of the existing accounts, built at run time
  async ({ effects }) => {
    const usernames = await listUsernames(effects)
    if (usernames.length === 0) {
      throw new Error(
        i18n('No accounts exist yet. Create your account in the web UI first.'),
      )
    }
    return InputSpec.of({
      username: Value.select({
        name: i18n('Account'),
        description: i18n('The account whose password will be reset.'),
        default: usernames[0],
        values: Object.fromEntries(usernames.map((u) => [u, u])),
      }),
    })
  },

  // no prefill
  async ({ effects }) => ({}),

  // execution
  async ({ effects, input }) => {
    const secrets = await ensureSecrets(effects)
    const password = utils.getDefaultString({ charset: 'a-z,A-Z,1-9', len: 22 })

    // Hash the generated password with the app's own argon2, in a throwaway
    // server container. argon2.verify reads its parameters from the hash
    // string, so a hash produced here validates against the running server.
    let passwordHash = ''
    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'server' },
      sdk.Mounts.of(),
      'reset-password-hash',
      async (sub) => {
        const res = await sub.execFail(
          [
            'node',
            '-e',
            "import('argon2').then(async m=>{const a=m.hash?m:m.default;process.stdout.write(await a.hash(process.env.BUNKER_PASSWORD))}).catch(e=>{console.error(String(e));process.exit(1)})",
          ],
          { env: { BUNKER_PASSWORD: password } },
        )
        passwordHash = res.stdout.toString().trim()
      },
    )

    // Write the new hash for the selected account.
    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'db' },
      sdk.Mounts.of(),
      'reset-password-update',
      async (sub) => {
        await sub.execFail(
          [
            'psql',
            '-h',
            '127.0.0.1',
            '-U',
            postgresUser,
            '-d',
            postgresDatabase,
            '-v',
            'ON_ERROR_STOP=1',
            '-tAc',
            `UPDATE users SET password_hash = '${sqlEsc(passwordHash)}', updated_at = now() WHERE username = '${sqlEsc(input.username)}'`,
          ],
          { env: { PGPASSWORD: secrets.POSTGRES_PASSWORD } },
        )
      },
    )

    return {
      version: '1',
      title: i18n('Success'),
      message: i18n('Password reset. Log in with the new credentials below.'),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: input.username,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: i18n(
              'Save this now — it is not stored and cannot be shown again.',
            ),
            value: password,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
