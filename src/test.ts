import generate from '.'

const testConfigURL = 'https://mims.hbfocus.cn/api/v3/api-docs'

generate({
  out: './dist/testServices',
  url: testConfigURL,
  isDirectReturnData: true,
  operationIdForeach: (operationId: string) => {
    return operationId.match(/[a-zA-Z]+/g)?.join('') ?? operationId
  },
})
