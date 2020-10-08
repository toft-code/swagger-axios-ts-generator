import { generate } from '.'

const testConfigURL = 'https://mims.hbfocus.cn/api/v3/api-docs'
// const testConfigURL = 'https://generator3.swagger.io/openapi.json'

generate({
  out: '../services',
  url: testConfigURL,
  operationIdForeach: (operationId: string) => {
    return operationId.match(/[a-zA-Z]+/g)?.join('') ?? operationId
  },
})
