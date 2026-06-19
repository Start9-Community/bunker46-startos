export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Bunker46': 0,
  'API Server': 1,
  'The API server is ready': 2,
  'The API server is not ready': 3,
  'Web Interface': 4,
  'The web interface is ready': 5,
  'The web interface is not ready': 6,
  'After creating your account in the web UI, run this action to disable open registration.': 7,

  // interfaces.ts
  'Web UI': 8,
  'The Bunker46 web interface': 9,

  // actions/registrations.ts
  'Disable Registrations': 10,
  'Enable Registrations': 11,
  'New-user registration is currently enabled. Run this action to prohibit new sign-ups.': 12,
  'New-user registration is currently disabled. Run this action to permit new sign-ups.': 13,
  'Anyone who can reach your Bunker46 address can create an account. Disable registration once you have created your own account.': 14,

  // actions/resetPassword.ts
  'Reset Account Password': 15,
  'Generate a new password for an existing account — use this if you are locked out and cannot sign in.': 16,
  Account: 17,
  'The account whose password will be reset.': 18,
  'No accounts exist yet. Create your account in the web UI first.': 19,
  Success: 20,
  'Password reset. Log in with the new credentials below.': 21,
  Username: 22,
  Password: 23,
  'Save this now — it is not stored and cannot be shown again.': 24,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
