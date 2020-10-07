import { IParameter, ISchema } from '../../type/SwaggerConfigType'
import toTypescriptType from '../../utils/toTypescriptType'

function getType(schema: ISchema) {
  if (!schema) {
    return 'any'
  }

  const { type, format, items } = schema

  if (type === 'array' && items?.type) {
    return toTypescriptType(items?.type, format) + '[]'
  } else if (type === 'array') {
    return 'any[]'
  } else if (type) {
    return toTypescriptType(type, format)
  }
}

export function getParametersType(parameters: IParameter[]) {
  if (!parameters || !parameters.filter) return ''

  // 'id: number, sort: string[]'
  return parameters
    .map((parameter) => {
      const parameterType = getType(parameter.schema)

      if (!parameter.schema) {
        console.log(parameter)
      }

      return (
        `'${parameter.name}'` +
        (parameter.required ? ':' : '?:') +
        parameterType
      )
    })
    .join(',')
}
