import { Paths, Tag } from '../../type/SwaggerConfigType'
import formatCode from '../../utils/formatCode'
import { getBodyDataType } from './getBodyDataType'
import { getParameters } from './getParameters'
import { getParametersType } from './getParametersType'

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
  let requestExpressions = ''
  let importExpressionSet = new Set()

  requests.forEach(({ path, httpMethod, requestDefinition }) => {
    const {
      operationId,
      requestBody,
      parameters,
      summary = 'no summary',
    } = requestDefinition
    const pathParametersType = getParametersType(parameters)
    const pathParameters = getParameters(parameters)
    const { bodyType, bodyTypeImportsSet } = getBodyDataType(requestBody)
    const pathWithPathParams = path.replace(/{/g, '${params.')

    const requestExpression = `
      /**
       * ${summary}
       */
      ${operationId} (
        ${pathParametersType ? `params: {${pathParametersType}},` : ''}
        ${bodyType}
        options: AxiosRequestConfig = {}
      ) {
        return request<any>({
          ${pathParameters ? `params: {${pathParameters}},` : ''}
          ${bodyType ? `data,` : ''}
          url: \`${pathWithPathParams}\`,
          method: '${httpMethod}',
          ...options
        })
      },
    `

    requestExpressions += requestExpression

    if (bodyTypeImportsSet) {
      importExpressionSet = new Set([
        ...importExpressionSet,
        ...bodyTypeImportsSet,
      ])
    }
  })

  let code = `
  import { request } from '.'
  import { AxiosRequestConfig } from 'axios'
  ${Array.from(importExpressionSet).join('\n')}

  export default {
    ${requestExpressions}
  }
  `

  return formatCode(code)
}
