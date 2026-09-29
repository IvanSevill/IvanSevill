export function getBuildIdentity(environment = {}) {
  const version = environment.VITE_APP_VERSION?.trim() || 'dev'
  const revision = environment.VITE_APP_COMMIT?.trim() || 'local'

  return {
    version,
    commit: revision === 'local' ? revision : revision.slice(0, 8),
  }
}
