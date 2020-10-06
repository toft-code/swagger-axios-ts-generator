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
  let importExpression = ''

  // properties
  if (properties) {
    for (const [key, value] of Object.entries(properties)) {
      const isRequired = schemaValue.required?.some((item) => item === key)
      const { type, ref, isEnum } = getPropertyInfo(key, value)

      if (ref) {
        const express = `import { ${ref} } from './${ref}'\n`

        if (withImportExpression && !importExpression.includes(express)) {
          importExpression += express
        }
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
  const content = `
    export interface ${pascalCase(schemaName)} {
      ${keyValue}
    }
  `

  return formatCode(importExpression + content + openapiComment(schemaValue))
}
