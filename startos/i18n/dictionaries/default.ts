export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Bunker46': 0,
  'Web Interface': 1,
  'The web interface is ready': 2,
  'The web interface is not ready': 3,
  Database: 6,
  'The database is ready': 7,
  'The database is not ready': 8,
  Redis: 9,
  'Redis is ready': 10,
  'Redis is not ready': 11,
  'API Server': 12,
  'The API server is ready': 13,
  'The API server is not ready': 14,

  // interfaces.ts
  'Web UI': 4,
  'The Bunker46 web interface': 5,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
