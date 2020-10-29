import generate from '.'

const testConfigURL =
  'https://raw.githubusercontent.com/toft-code/swagger-axios-ts-generator/master/test.json'

generate({
  out: './testServices',
  url: testConfigURL,
  isDirectReturnData: false,
  operationIdForeach: (operationId: string) => {
    return operationId.match(/[a-zA-Z]+/g)?.join('') ?? operationId
  },
})
