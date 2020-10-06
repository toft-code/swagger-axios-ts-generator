import { generate } from '.'

const testConfigURL = 'https://mims.hbfocus.cn/api/v3/api-docs'
// const testConfigURL = 'https://generator3.swagger.io/openapi.json'

generate({
  url: testConfigURL,
})
