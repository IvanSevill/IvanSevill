const REPOSITORY_URL = 'https://github.com/IvanSevill/IvanSevill'

export function getBuildIdentity(environment = {}) {
  const version = environment.VITE_APP_VERSION?.trim() || 'dev'
  const revision = environment.VITE_APP_COMMIT?.trim() || 'local'
  const commit = revision === 'local' ? revision : revision.slice(0, 8)

  return {
    version,
    commit,
    commitUrl: revision === 'local' ? undefined : `${REPOSITORY_URL}/commit/${revision}`,
  }
}
