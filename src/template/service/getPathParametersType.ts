import { IParameter, ISchema } from '../../type/SwaggerConfigType'
import toTypescriptType from '../../utils/toTypescriptType'

function getType(schema: ISchema) {
  const { type, format, items } = schema

  if (type === 'array' && items?.type) {
    return toTypescriptType(items?.type, format) + '[]'
  } else if (type === 'array') {
    return 'any[]'
  } else if (type) {
    return toTypescriptType(type, format)
  }
}

export function getPathParametersType(parameters: IParameter[]) {
  if (!parameters || !parameters.filter) return ''

  // 'id: number, sort: string[]'
  return parameters
    .map((parameter) => {
      const parameterType = getType(parameter.schema)

      return (
        `'${parameter.name}'` +
        (parameter.required ? ':' : '?:') +
        parameterType
      )
    })
    .join(',')
}
