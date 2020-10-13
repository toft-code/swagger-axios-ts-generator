import { getConfig } from '../../globalConfig'
import { Paths, Tag } from '../../type/SwaggerConfigType'
import formatCode from '../../utils/formatCode'
import { removeBlankLines } from '../../utils/removeBlankLines'
import { getBodyDataType } from './getBodyDataType'
import { getParameters } from './getParameters'
import { getParametersType } from './getParametersType'
import { getResponses } from './getResponses'

function getRequestsByTag(tag: Tag, paths: Paths) {
  const { name: tagName } = tag
  const selectedRequests = []

  /**
   * path - "/auth/updatePwd"
   * pathValue - { "post": {...}, "get": {...} }
   */
  for (const [path, pathValue] of Object.entries(paths)) {
    /**
     * httpMethod - "post"
     * requestDefinition - { "tags": [], "operationId": "updatePwd" ... }
     */
    for (const [httpMethod, requestDefinition] of Object.entries(pathValue)) {
      if (requestDefinition.tags.includes(tagName)) {
        selectedRequests.push({
          path,
          pathValue,
          httpMethod,
          requestDefinition,
        })
      }
    }
  }

  return selectedRequests
}

export function generateService(tag: Tag, paths: Paths) {
  const requests = getRequestsByTag(tag, paths)
  const { operationIdForeach } = getConfig()
  let requestExpressions = ''
  let importExpressionSet = new Set()

  requests.forEach(({ path, httpMethod, requestDefinition }) => {
    const {
      operationId,
      requestBody,
      parameters,
      responses,
      summary = 'no summary',
    } = requestDefinition
    const operationIdAfter = operationIdForeach(operationId)
    const pathParametersType = getParametersType(parameters)
    const pathParameters = getParameters(parameters)
    const { bodyType, bodyTypeImportsSet } = getBodyDataType(requestBody)
    const pathWithPathParams = path.replace(/{/g, '${params.')
    const { responseTypeExpression, responseImportsSet } = getResponses(
      responses
    )

    const requestExpression = `
      /**
       * ${summary}
       */
      ${operationIdAfter} (
        ${pathParametersType ? `params: {${pathParametersType}},` : ''}
        ${bodyType}
        options: AxiosRequestConfig = {}
      ) {
        return request${responseTypeExpression}({
          ${pathParameters ? `params: {${pathParameters}},` : ''}
          ${bodyType ? `data,` : ''}
          url: \`${pathWithPathParams}\`,
          method: '${httpMethod}',
          ...options
        })
      },
    `

    requestExpressions += removeBlankLines(requestExpression) + '\n'

    importExpressionSet = new Set([
      ...importExpressionSet,
      ...responseImportsSet,
      ...bodyTypeImportsSet,
    ])
  })

  let code = `
    import { request } from '.'
    import { AxiosRequestConfig } from 'axios'
    ${Array.from(importExpressionSet).sort().join('\n')}

    export default {
      ${requestExpressions}
    }
  `

  return formatCode(code)
}
