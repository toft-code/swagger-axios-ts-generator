import { getConfig } from '../../globalConfig'
import { IRequestMethodResponse } from '../../type/SwaggerConfigType'
import { refName } from '../../utils/refName'

export function getResponses(responses: IRequestMethodResponse) {
  const schema = responses?.['200']?.content?.['*/*']?.schema
  const responseImportsSet = new Set()
  let responseType = 'any'

  function addImport(type: string) {
    responseImportsSet.add(`import { ${type} } from './interfaces/${type}'`)
  }

  if (!schema) {
    return {
      responseType,
      responseImportsSet,
    }
  }

  if (schema.$ref) {
    // "schema": {
    //   "$ref": "#/components/schemas/DataSyncVo"
    // }
    responseType = refName(schema.$ref)
    addImport(refName(schema.$ref))
  } else if (schema.type === 'array' && schema.items?.$ref) {
    // "schema": {
    //   "type": "array",
    //   "items": {
    //     "$ref": "#/components/schemas/Device"
    //   }
    // }
    responseType = refName(schema.items.$ref) + '[]'
    addImport(refName(schema.items.$ref))
  } else if (schema.type === 'object' && schema.properties) {
    // "schema": {
    //   "type": "object",
    //   "properties": {
    //     "name": {
    //       "type": "string"
    //     }
    //   }
    // }
    let expression = ''

    for (let [key, value] of Object.entries(schema.properties)) {
      expression += `${key}: ${value.type}\n`
    }

    responseType = `
      {
        ${expression}
      }
    `
  }

  const directReturnData = getConfig().isDirectReturnData ? 'any,' : ''

  return {
    responseTypeExpression: '<' + directReturnData + responseType + '>',
    responseImportsSet,
  }
}
