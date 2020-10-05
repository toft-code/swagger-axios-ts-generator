import { IDefinition } from '../../type/SwaggerConfigType'
import formatCode from '../../utils/formatCode'
import { getPropertyInfo } from '../../utils/getPropertyInfo'

export function generateEnum(schemaName: string, schemaValue: IDefinition) {
  const { properties } = schemaValue
  let resultArray = []

  if (properties) {
    for (const [key, value] of Object.entries(properties)) {
      const { type, isEnum, enumValue } = getPropertyInfo(key, value)

      if (isEnum) {
        const template = `export type ${type} = ${enumValue}`

        const code = formatCode(template)

        resultArray.push({
          name: type,
          code,
        })
      }
    }
  }

  return resultArray
}
