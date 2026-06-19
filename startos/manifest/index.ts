import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'bunker46',
  title: 'Bunker46',
  license: 'MIT',
  packageRepo: 'https://github.com/Start9-Community/bunker46-startos',
  upstreamRepo: 'https://github.com/dsbaars/bunker46',
  marketingUrl: 'https://bunker46.github.io/',
  donationUrl: null,
  description: { short, long },
  volumes: ['startos', 'db'],
  images: {
    db: {
      source: { dockerTag: 'postgres:17-alpine' },
      arch: ['x86_64', 'aarch64'],
    },
    valkey: {
      source: { dockerTag: 'valkey/valkey:8-alpine' },
      arch: ['x86_64', 'aarch64'],
    },
    server: {
      source: { dockerBuild: { dockerfile: 'Dockerfile.server' } },
      arch: ['x86_64', 'aarch64'],
    },
    web: {
      source: { dockerBuild: { dockerfile: 'Dockerfile.web' } },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
