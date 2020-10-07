import { IRequestBody } from '../../type/SwaggerConfigType'

export function getBodyDataType(requestBody: IRequestBody) {
  if (!requestBody) return ''

  const { content, required } = requestBody
  console.log(requestBody)

  const requiredSign = required ? ':' : '?:'

  content['application/json']

  return requiredSign
}
