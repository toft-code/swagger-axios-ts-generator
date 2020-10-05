import fs from 'fs-extra'
import { generateEnum } from './template/enum'
import { generateInterface } from './template/interface'
import { SwaggerConfigType } from './type/SwaggerConfigType'
import pascalCase from './utils/pascalCase'

export function createFiles(rootDir: string, swaggerJSON: SwaggerConfigType) {
  // init dir
  fs.removeSync(rootDir)
  fs.mkdirSync(rootDir)
  fs.mkdirSync(rootDir + '/interfaces')

  // components
  const { schemas } = swaggerJSON.components

  for (const [schemaName, schemaValue] of Object.entries(schemas)) {
    // write file
    fs.writeFileSync(
      rootDir + `/interfaces/${pascalCase(schemaName)}.ts`,
      generateInterface(schemaName, schemaValue)
    )

    generateEnum(schemaName, schemaValue).map(({ name, code }) => {
      fs.writeFileSync(rootDir + `/interfaces/${name}.ts`, code)
    })
  }
}
