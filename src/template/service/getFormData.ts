import { IRequestBody } from '../../type/SwaggerConfigType'

export default function getFormData(requestBody: IRequestBody) {
  if (!requestBody) return ''
  const { content } = requestBody

  const schema = content?.['multipart/form-data']?.schema

  if (!schema) return ''

  let code = ''

  if (schema.type === 'object' && schema.properties) {
    for (let [key, value] of Object.entries(schema.properties)) {
      code += `formData.append('${key}', data.${key})`
    }
  }

  return `
    const formData = new FormData()

    ${code}
  `
}
