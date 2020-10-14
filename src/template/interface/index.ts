import { IDefinition } from '../../type/SwaggerConfigType'
import formatCode from '../../utils/formatCode'
import { getPropertyInfo } from '../../utils/getPropertyInfo'
import { openapiComment } from '../../utils/openapiComment'
import pascalCase from '../../utils/pascalCase'

export function generateInterface(
  schemaName: string,
  schemaValue: IDefinition,
  withImportExpression: boolean = true
) {
  const { properties } = schemaValue
  let keyValueMap = new Map()
  let importExpressionSet = new Set<string>()

  // properties
  if (properties) {
    for (const [key, value] of Object.entries(properties)) {
      const isRequired = schemaValue.required?.some((item) => item === key)
      const { type, ref } = getPropertyInfo(key, value)

      if (ref && withImportExpression) {
        importExpressionSet.add(ref)
      }

      /**
       * `blocked?: boolean`
       */
      keyValueMap.set(
        key,
        `
          /** ${value.description ?? 'no description'} */
          ${key}${isRequired ? '' : '?'}: ${type}
        `
      )
    }
  }

  const keyValueExpression = [...keyValueMap]
    .sort()
    .map((item) => item[1])
    .join('\n')

  // interface
  const interfaceExpression = `
    export interface ${pascalCase(schemaName)} {
      ${keyValueExpression}
    }
  `

  const importExpression = Array.from(importExpressionSet)
    .sort()
    .map((ref) => `import { ${ref} } from './${ref}'\n`)
    .join('')

  return formatCode(
    importExpression + interfaceExpression + openapiComment(schemaValue)
  )
}
