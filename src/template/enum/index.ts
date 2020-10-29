import { IDefinition } from '../../type/SwaggerConfigType'
import formatCode from '../../utils/formatCode'
import { getPropertyInfo } from '../../utils/getPropertyInfo'
import { openapiComment } from '../../utils/openapiComment'

export function generateEnum(schemaName: string, schemaValue: IDefinition) {
  const { properties } = schemaValue
  let resultArray = []

  if (properties) {
    for (const [key, value] of Object.entries(properties)) {
      const { type, isEnum, enumValue } = getPropertyInfo(
        schemaName,
        key,
        value
      )

      if (isEnum) {
        const enumExpression = `
          /** ${value.description ?? 'no description'} */
          export enum ${type} {
            ${enumValue}
          }
        `

        resultArray.push({
          name: type,
          code: formatCode(enumExpression + openapiComment(value)),
        })
      }
    }
  }

  return resultArray
}
