import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { getBuildIdentity } from './version'

const appSource = readFileSync(new URL('./App.jsx', import.meta.url), 'utf8')

describe('build identity', () => {
  it('formats the release tag and abbreviated commit with a commit link', () => {
    expect(getBuildIdentity({
      VITE_APP_VERSION: 'v1.2.3',
      VITE_APP_COMMIT: '0123456789abcdef0123456789abcdef01234567',
    })).toEqual({
      version: 'v1.2.3',
      commit: '01234567',
      commitUrl: 'https://github.com/IvanSevill/IvanSevill/commit/0123456789abcdef0123456789abcdef01234567',
    })
  })

  it('uses explicit development fallbacks without build metadata', () => {
    expect(getBuildIdentity()).toEqual({ version: 'dev', commit: 'local', commitUrl: undefined })
  })

  it('links the footer build marker to the deployed commit', () => {
    expect(appSource).toContain('build.commitUrl')
    expect(appSource).toContain('{build.version} · {build.commit}')
  })
})
