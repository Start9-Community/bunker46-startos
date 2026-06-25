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

  // interfaces.ts
  'Web UI': 7,
  'The Bunker46 web interface': 8,

  // actions/registrations.ts
  'Disable Registrations': 9,
  'Enable Registrations': 10,
  'New-user registration is currently enabled. Run this action to prohibit new sign-ups.': 11,
  'New-user registration is currently disabled. Run this action to permit new sign-ups.': 12,
  'Anyone who can reach your Bunker46 address can create an account. Disable registration once you have created your own account.': 13,

  // actions/resetPassword.ts
  'Reset Account Password': 14,
  'Generate a new password for an existing account — use this if you are locked out and cannot sign in.': 15,
  Account: 16,
  'The account whose password will be reset.': 17,
  'No accounts exist yet. Create your account in the web UI first.': 18,
  Success: 19,
  'Password reset. Log in with the new credentials below.': 20,
  Username: 21,
  Password: 22,
  'Save this now — it is not stored and cannot be shown again.': 23,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
