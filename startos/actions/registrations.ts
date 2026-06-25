import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const registrations = sdk.Action.withoutInput(
  // id
  'registrations',

  // metadata
  async ({ effects }) => {
    const allowed =
      (await storeJson.read((s) => s.allowRegistration).const(effects)) ?? false

    return {
      name: allowed
        ? i18n('Disable Registrations')
        : i18n('Enable Registrations'),
      description: allowed
        ? i18n(
            'New-user registration is currently enabled. Run this action to prohibit new sign-ups.',
          )
        : i18n(
            'New-user registration is currently disabled. Run this action to permit new sign-ups.',
          ),
      warning: allowed
        ? i18n(
            'Anyone who can reach your Bunker46 address can create an account. Disable registration once you have created your own account.',
          )
        : null,
      allowedStatuses: 'any',
      group: null,
      visibility: 'enabled',
    }
  },

  // the execution function
  async ({ effects }) => {
    const allowed =
      (await storeJson.read((s) => s.allowRegistration).once()) ?? false

    await storeJson.merge(effects, { allowRegistration: !allowed })
  },
)
