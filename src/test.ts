import generate from '.'

const testConfigURL = 'https://mims.hbfocus.cn/api/v3/api-docs'

generate({
  out: './testServices',
  url: testConfigURL,
  operationIdForeach: (operationId: string) => {
    return operationId.match(/[a-zA-Z]+/g)?.join('') ?? operationId
  },
})
