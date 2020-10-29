# @toft-code/swagger-axios-ts-generator

[![npm version](https://badge.fury.io/js/%40toft-code%2Fswagger-axios-ts-generator.svg)](https://badge.fury.io/js/%40toft-code%2Fswagger-axios-ts-generator)

## Install

```shell
$ npm install @toft-code/swagger-axios-ts-generator
```

```shell
$ yarn add @toft-code/swagger-axios-ts-generator
```

## Example

[Example Link](https://github.com/toft-tech/swagger-axios-ts-generator-example)

### TypeScript

```ts
import { generate } from '@toft-code/swagger-axios-ts-generator'

generate({
  // out files path
  out: './testServices',

  // service name suffix
  serviceNameSuffix: 'Service',

  // api json url
  url:
    'https://raw.githubusercontent.com/toft-code/swagger-axios-ts-generator/master/test.json',

  // foreach operationId
  operationIdForeach: (operationId: string) => {
    return operationId.match(/[a-zA-Z]+/g)?.join('') ?? operationId
  },

  // services/index.ts template
  requestTemplateUrl:
    'https://raw.githubusercontent.com/toft-tech/swagger-axios-ts-generator/master/src/template/indexAxiosTemplate.ts',
})
```

### CommonJS

```js
const { generate } = require('@toft-code/swagger-axios-ts-generator')

generate({
  out: './src/testService',
  url:
    'https://raw.githubusercontent.com/toft-code/swagger-axios-ts-generator/master/test.json',
})
```

## Other

Thanks [Manweill/swagger-axios-codegen](https://github.com/Manweill/swagger-axios-codegen)
