import fs from 'fs-extra'
import { generateEnum } from './template/enum'
import { generateInterface } from './template/interface'
import { generateService } from './template/service'
import { SwaggerConfigType } from './type/SwaggerConfigType'
import pascalCase from './utils/pascalCase'

export function createInterfaceFile(
  rootDir: string,
  name: string,
  code: string
) {
  return fs.writeFile(rootDir + `/interfaces/${pascalCase(name)}.ts`, code)
}

export function createServiceFile(rootDir: string, name: string, code: string) {
  return fs.writeFile(rootDir + `/${pascalCase(name)}.ts`, code)
}

export function createIndexAxiosFile() {
  console.log(process.cwd())

  // const res = fs.readFileSync(
  //   process.cwd() + '/../template/indexAxiosTemplate.ts',
  //   'utf8'
  // )
}

export function createFiles(rootDir: string, swaggerJSON: SwaggerConfigType) {
  // init dir
  fs.removeSync(rootDir)
  fs.mkdirSync(rootDir)
  fs.mkdirSync(rootDir + '/interfaces')

  createIndexAxiosFile()

  // interface
  const schemasEntries = Object.entries(swaggerJSON.components.schemas)

  for (const [schemaName, schemaValue] of schemasEntries) {
    // normal interface
    createInterfaceFile(
      rootDir,
      schemaName,
      generateInterface(schemaName, schemaValue)
    )

    // enum
    generateEnum(schemaValue).map(({ name, code }) => {
      createInterfaceFile(rootDir, name, code)
    })
  }

  // service
  swaggerJSON.tags.forEach((tag) => {
    createServiceFile(
      rootDir,
      tag.name,
      generateService(tag, swaggerJSON.paths)
    )
  })
}
