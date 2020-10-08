# @toftcode/swagger-axios-ts-generator

## Install

```shell
$ npm install @toftcode/swagger-axios-ts-generator
```

```shell
$ yarn add @toftcode/swagger-axios-ts-generator
```

## Example

[Example Link](https://github.com/toft-tech/swagger-axios-ts-generator-example)

```ts
import { generate } from '@toftcode/swagger-axios-ts-generator'

generate({
  // out files path
  out: './testServices',

  // api json url
  url:
    'https://raw.githubusercontent.com/toftcode/swagger-axios-ts-generator/master/test.json',

  // foreach operationId
  operationIdForeach: (operationId: string) => {
    return operationId.match(/[a-zA-Z]+/g)?.join('') ?? operationId
  },

  // services/index.ts template
  requestTemplateUrl:
    'https://raw.githubusercontent.com/toft-tech/swagger-axios-ts-generator/master/src/template/indexAxiosTemplate.ts',
})
```

## Other

Thanks [Manweill/swagger-axios-codegen](https://github.com/Manweill/swagger-axios-codegen)
