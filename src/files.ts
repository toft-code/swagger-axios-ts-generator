import fs from 'fs-extra'
import { getConfig } from './globalConfig'
import { generateEnum } from './template/enum'
import { generateInterface } from './template/interface'
import { generateService } from './template/service'
import { SwaggerConfigType } from './type/SwaggerConfigType'
import { loadRemoteFile } from './utils/loadRemoteFile'
import pascalCase from './utils/pascalCase'

const { writeFile } = fs

export function createInterfaceFile(
  rootDir: string,
  name: string,
  code: string
) {
  return writeFile(rootDir + `/interfaces/${pascalCase(name)}.ts`, code)
}

export function createServiceFile(rootDir: string, name: string, code: string) {
  return writeFile(rootDir + `/${pascalCase(name)}.ts`, code)
}

export async function createIndexAxiosFile() {
  const { requestTemplateUrl, out } = getConfig()

  if (requestTemplateUrl) {
    const code = await loadRemoteFile('request template', requestTemplateUrl)
    writeFile(out + `/index.ts`, code)
  }
}

export async function createFiles(
  rootDir: string,
  swaggerJSON: SwaggerConfigType
) {
  // init dir
  fs.removeSync(rootDir)
  fs.mkdirSync(rootDir)
  fs.mkdirSync(rootDir + '/interfaces')

  await createIndexAxiosFile()

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
