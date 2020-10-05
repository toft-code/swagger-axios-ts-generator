import semver from 'semver'

export default function checkOpenAPIVersion(version?: string) {
  if (!version) throw new Error('Unknown version')

  if (!semver.satisfies(version, '>=3.0.0')) {
    throw new Error('Minimax version is 3.0.0')
  }
}
