import { IParameter, ISchema } from '../../type/SwaggerConfigType'
import { requiredSign } from '../../utils/requiredSign'
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
      const { description, schema, required, name } = parameter
      const parameterType = getType(schema)

      if (!schema) {
        console.log(parameter)
      }

      return `
        ${description ? `/** ${description} */` : ''}
        '${name}'${requiredSign(required)} ${parameterType}
      `
    })
    .join(',')
}
