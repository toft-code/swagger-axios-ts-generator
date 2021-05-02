import { getConfig } from '../../globalConfig'
import { Paths, Tag } from '../../type/SwaggerConfigType'
import formatCode from '../../utils/formatCode'
import pascalCase from '../../utils/pascalCase'
import { removeBlankLines } from '../../utils/removeBlankLines'
import { getBodyDataType } from './getBodyDataType'
import getFormData from './getFormData'
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
      if (requestDefinition.tags?.includes(tagName)) {
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
  const { operationIdForeach, serviceNameSuffix } = getConfig()
  const serviceName = `${pascalCase(tag.name)}${serviceNameSuffix}`
  let requestExpressionMap = new Map<string, string>()
  let importExpressionSet = new Set()

  requests.forEach(({ path, httpMethod, requestDefinition }) => {
    const {
      operationId,
      requestBody,
      parameters,
      responses,
      summary,
      description,
    } = requestDefinition
    const isMultipartFormData = !!requestBody?.content?.['multipart/form-data']
    const operationIdAfter = operationIdForeach(operationId)
    const pathParametersType = getParametersType(parameters)
    const pathParameters = getParameters(parameters)
    const { bodyType, bodyTypeImportsSet } = getBodyDataType(requestBody)
    const pathWithPathParams = path.replace(/{/g, '${params.')
    const formData = getFormData(requestBody)
    const { responseTypeExpression, responseImportsSet } = getResponses(
      responses
    )

    const requestExpression = `
      /**
       * ${summary || description || 'no description'}
       */
      ${operationIdAfter} (
        ${pathParametersType ? `params: {${pathParametersType}},` : ''}
        ${bodyType}
        options: AxiosRequestConfig = {}
      ) {
        ${formData}

        return request${responseTypeExpression}({
          ${pathParameters ? `params: {${pathParameters}},` : ''}
          ${bodyType && !isMultipartFormData ? `data,` : ``}
          ${bodyType && isMultipartFormData ? `data: formData,` : ``}
          url: \`${pathWithPathParams}\`,
          method: '${httpMethod}',
          ...options
        })
      },
    `

    requestExpressionMap.set(
      operationIdAfter,
      removeBlankLines(requestExpression)
    )

    importExpressionSet = new Set([
      ...importExpressionSet,
      ...responseImportsSet,
      ...bodyTypeImportsSet,
    ])
  })

  const requestExpressions = [...requestExpressionMap]
    .sort()
    .map((item) => item[1])
    .join('\n')

  let code = `
    import { request } from '.'
    import { AxiosRequestConfig } from 'axios'
    ${Array.from(importExpressionSet).sort().join('\n')}

    const ${serviceName} = {
      ${requestExpressions}
    }

    export default ${serviceName}
  `

  return formatCode(code)
}
