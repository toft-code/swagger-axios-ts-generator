import { IParameter } from '../../type/SwaggerConfigType'
import toTypescriptType from '../../utils/toTypescriptType'

export function getPathParametersType(parameters: IParameter[]) {
  if (!parameters || !parameters.filter) return ''

  // 'id: number, id2: number'
  return parameters
    .map((parameter) => {
      return (
        `'${parameter.name}'` +
        (parameter.required ? ':' : '?:') +
        toTypescriptType(parameter.schema.type)
      )
    })
    .join(',')
}
