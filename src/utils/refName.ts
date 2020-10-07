import pascalCase from './pascalCase'

export function refName(ref: string) {
  if (ref) {
    return pascalCase(ref.split('schemas/')[1])
  } else {
    return ''
  }
}
