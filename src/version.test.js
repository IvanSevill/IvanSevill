import { describe, expect, it } from 'vitest'
import { getBuildIdentity } from './version'

describe('build identity', () => {
  it('formats the release tag and abbreviated commit', () => {
    expect(getBuildIdentity({
      VITE_APP_VERSION: 'v1.2.3',
      VITE_APP_COMMIT: '0123456789abcdef0123456789abcdef01234567',
    })).toEqual({ version: 'v1.2.3', commit: '01234567' })
  })

  it('uses explicit development fallbacks without build metadata', () => {
    expect(getBuildIdentity()).toEqual({ version: 'dev', commit: 'local' })
  })
})
