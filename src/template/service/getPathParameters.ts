import { IParameter } from '../../type/SwaggerConfigType'

export function getPathParameters(parameters: IParameter[]) {
  if (!parameters || !parameters.filter) return ''

  // `'id': params['id'], 'id2': params['id2']`
  return parameters
    .map((parameter) => {
      return `'${parameter.name}': params['${parameter.name}']`
    })
    .join(',')
}
