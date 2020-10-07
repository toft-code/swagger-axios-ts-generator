import { IParameter, Paths, Tag } from '../../type/SwaggerConfigType'
import formatCode from '../../utils/formatCode'
import toTypescriptType from '../../utils/toTypescriptType'

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

export function operationIdMap(id: string) {
  return id
}

export function getPathParametersType(parameters: IParameter[]) {
  if (!parameters || !parameters.filter) return ''

  // 'id: number, id2: number'
  return parameters
    .map((parameter) => {
      return (
        `'${parameter.name}'` +
        (parameter.required ? ':' : '?:') +
        toTypescriptType(parameter.schema.type)
      )
    })
    .join(',')
}

export function getPathParameters(parameters: IParameter[]) {
  if (!parameters || !parameters.filter) return ''

  // 'id: number, id2: number'
  return parameters
    .map((parameter) => {
      return `'${parameter.name}': params['${parameter.name}']`
    })
    .join(',')
}

export function generateService(tag: Tag, paths: Paths) {
  const requests = getRequestsByTag(tag, paths)
  let requestExpressions = ''

  requests.forEach(({ path, httpMethod, requestDefinition }) => {
    // todo responses

    const {
      operationId,
      requestBody,
      parameters,
      summary = 'no summary',
    } = requestDefinition
    const pathParametersType = getPathParametersType(parameters)
    const pathParameters = getPathParameters(parameters)
    const hasRequestBody = !!requestBody
    const hasPathParameters = !!pathParametersType
    const pathWithPathParams = path.replace(/{/g, '${params.')

    const requestExpression = `
    /**
     * ${summary}
     */
    ${operationId} (
      ${hasPathParameters ? `params: {${pathParametersType}},` : ''}
      options: AxiosRequestConfig = {}
    ) {
      return request({
        ${pathParameters ? `params: {${pathParameters}},` : ''}
        url: \`${pathWithPathParams}\`,
        method: '${httpMethod}',
        ...options
      })
    },
    `

    requestExpressions += requestExpression
  })

  let code = `
  import { request } from '.'
  import { AxiosRequestConfig } from 'axios'

  export default {
    ${requestExpressions}
  }
  `

  return formatCode(code)
}
