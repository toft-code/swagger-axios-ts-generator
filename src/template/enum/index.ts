import { IDefinition } from '../../type/SwaggerConfigType'
import formatCode from '../../utils/formatCode'
import { getPropertyInfo } from '../../utils/getPropertyInfo'

export function generateEnum(schemaValue: IDefinition) {
  const { properties } = schemaValue
  let resultArray = []

  if (properties) {
    for (const [key, value] of Object.entries(properties)) {
      const { type, isEnum, enumValue } = getPropertyInfo(key, value)

      if (isEnum) {
        const template = `
          export enum ${type} {
            ${enumValue}
          }
        `

        // openapi json
        const openapiComment = '/*\n' + JSON.stringify(value, null, 2) + '\n*/'

        const code = formatCode(template + openapiComment)

        resultArray.push({
          name: type,
          code,
        })
      }
    }
  }

  return resultArray
}
