[Example](https://github.com/toft-tech/swagger-axios-ts-generator-example)

```ts
const { codegen } = require('swagger-axios-codegen')

codegen({
  methodNameMode: 'operationId',
  remoteUrl: 'http://222.128.10.85:6600/v3/api-docs',
  outputDir: './service',
  enumNamePrefix: 'Enum',
  useStaticMethod: true,
  multipleFileMode: true,
  modelMode: 'interface',
  useCustomerRequestInstance: true,
  useClassTransformer: false,
})
```

Thanks https://github.com/Manweill/swagger-axios-codegen
