import { Paths, Tag } from '../../type/SwaggerConfigType'
import formatCode from '../../utils/formatCode'

function getRequestsByTag(tag: Tag, paths: Paths) {
  const { name: tagName } = tag
  const selectedRequests = []

  /**
   * pathKey - "/auth/updatePwd"
   * pathValue - { "post": {...}, "get": {...} }
   */
  for (const [pathName, pathValue] of Object.entries(paths)) {
    /**
     * httpMethod - "post"
     * requestDefinition - { "tags": [], "operationId": "updatePwd" ... }
     */
    for (const [httpMethod, requestDefinition] of Object.entries(pathValue)) {
      if (requestDefinition.tags.includes(tagName)) {
        selectedRequests.push({
          pathName,
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

export function generateService(tag: Tag, paths: Paths) {
  const { name: tagName } = tag
  const requests = getRequestsByTag(tag, paths)
  let requestExpressions = ''

  console.log(tagName, requests.length)

  requests.forEach(({ pathName, httpMethod, requestDefinition }) => {
    // todo parameters
    // todo responses

    const requestExpression = `
    /**
     * ${requestDefinition.summary ?? 'no summary'}
     */
    ${requestDefinition.operationId} (
      params: any = {},
      options: AxiosRequestConfig = {}
    ) {
      return request({
        url: '${pathName}',
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
