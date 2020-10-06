import fs from 'fs-extra'
import { generateEnum } from './template/enum'
import { generateInterface } from './template/interface'
import { SwaggerConfigType } from './type/SwaggerConfigType'
import pascalCase from './utils/pascalCase'

function createInterfaceFile(rootDir: string, name: string, code: string) {
  fs.writeFileSync(rootDir + `/interfaces/${pascalCase(name)}.ts`, code)
}

export function createFiles(rootDir: string, swaggerJSON: SwaggerConfigType) {
  // init dir
  fs.removeSync(rootDir)
  fs.mkdirSync(rootDir)
  fs.mkdirSync(rootDir + '/interfaces')

  // components
  const schemasEntries = Object.entries(swaggerJSON.components.schemas)

  for (const [schemaName, schemaValue] of schemasEntries) {
    createInterfaceFile(
      rootDir,
      schemaName,
      generateInterface(schemaName, schemaValue)
    )

    generateEnum(schemaName, schemaValue).map(({ name, code }) => {
      createInterfaceFile(rootDir, name, code)
    })
  }
}
