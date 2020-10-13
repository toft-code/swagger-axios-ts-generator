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
  let keyValue = ''
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
      keyValue += `
        /** ${value.description ?? 'no description'} */
        ${key}${isRequired ? '' : '?'}: ${type}
      `
    }
  }

  // interface
  const interfaceExpression = `
    export interface ${pascalCase(schemaName)} {
      ${keyValue}
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
