import generate from '.'

const testConfigURL = 'https://demo.bjcsby.com/api/v3/api-docs'

generate({
  out: './testServices',
  url: testConfigURL,
  isDirectReturnData: false,
  operationIdForeach: (operationId: string) => {
    return operationId.match(/[a-zA-Z]+/g)?.join('') ?? operationId
  },
})
