import { IRequestBody } from '../../type/SwaggerConfigType'
import { refName } from '../../utils/refName'
import toTypescriptType from '../../utils/toTypescriptType'

export function getBodyDataType(requestBody: IRequestBody) {
  let bodyTypeImportsSet = new Set()
  let bodyType = ''

  if (!requestBody) return { bodyType, bodyTypeImportsSet }

  const { content, required } = requestBody
  const requiredSign = required ? ':' : '?:'
  let schema = content?.['application/json']?.schema

  if (content['multipart/form-data']) {
    schema = content?.['multipart/form-data']?.schema
  }

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

    if (schema.type === 'array') {
      bodyType += '[]'
    }
  } else if (schema.$ref) {
    // "content": {
    //   "application/json": {
    //     "schema": {
    //       "$ref": "#/components/schemas/FormDefinition"
    //     }
    //   }
    // },
    // "required": true
    bodyType = refName(schema.$ref)
    addImports(bodyType)
  } else if (schema.type === 'object' && schema.properties) {
    // 'content': {
    //   'application/json': {
    //     'schema': {
    //       'type': 'object',
    //       'properties': {
    //         'sessionUser': {
    //           '$ref': '#/components/schemas/SessionUser',
    //         },
    //         'request': {
    //           '$ref': '#/components/schemas/UserAddRequest',
    //         },
    //       },
    //     },
    //   },
    // },
    for (let [key, value] of Object.entries(schema.properties)) {
      let type = ''
      if (value.$ref) {
        type = refName(value.$ref)
        addImports(type)
      } else {
        type = 'File'
      }

      bodyType += `${key}:${type},`
    }

    bodyType = `{${bodyType}}`
  }

  if (bodyType) {
    bodyType = `data${requiredSign}${bodyType},`
  }

  return {
    bodyType,
    bodyTypeImportsSet,
  }
}
