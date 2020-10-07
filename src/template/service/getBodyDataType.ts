import { IRequestBody } from '../../type/SwaggerConfigType'
import { refName } from '../../utils/refName'
import toTypescriptType from '../../utils/toTypescriptType'

export function getBodyDataType(requestBody: IRequestBody) {
  let bodyTypeImportsSet = new Set()
  let bodyType = ''

  if (!requestBody) return { bodyType, bodyTypeImportsSet }

  const { content, required } = requestBody
  const requiredSign = required ? ':' : '?:'
  const schema = content?.['application/json']?.schema

  if (!schema) return { bodyType, bodyTypeImportsSet }

  function addImports(type: string) {
    bodyTypeImportsSet.add(`import { ${type} } from './interfaces/${type}'`)
  }

  if (schema.items) {
    // "requestBody": {
    //   "content": {
    //     "application/json": {
    //       "schema": {
    //         "type": "array",
    //         "items": {
    //           "type": "integer",
    //           "format": "int64"
    //         }
    //       }
    //     }
    //   },
    //   "required": true
    // },

    if (schema.items.$ref) {
      bodyType = refName(schema.items.$ref)
      addImports(bodyType)
    } else {
      bodyType = toTypescriptType(schema.items.type ?? '', schema.items.format)
    }

    if (schema.type && schema.type === 'array') {
      bodyType += '[]'
    }
  } else if (schema.$ref) {
    // "requestBody": {
    //   "content": {
    //     "application/json": {
    //       "schema": {
    //         "$ref": "#/components/schemas/FormDefinition"
    //       }
    //     }
    //   },
    //   "required": true
    // },
    bodyType = refName(schema.$ref)
    addImports(bodyType)
  }

  if (bodyType) {
    bodyType = `data${requiredSign}${bodyType},`
  }

  console.log(bodyType)

  return {
    bodyType,
    bodyTypeImportsSet,
  }
}
