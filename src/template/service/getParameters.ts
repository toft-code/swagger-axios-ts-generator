import { IParameter } from '../../type/SwaggerConfigType'

export function getParameters(parameters: IParameter[]) {
  if (!parameters || !parameters.filter) return ''

  // `'id': params['id'], 'id2': params['id2']`
  return parameters
    .filter((parameter) => parameter.in === 'query')
    .map((parameter) => {
      return `'${parameter.name}': params['${parameter.name}']`
    })
    .join(',')
}
