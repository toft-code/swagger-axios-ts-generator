import chalk from 'chalk'
import {
  initFiles,
  createIndexAxiosFile,
  createInterfaceFile,
  createServiceFile,
} from './files'
import { defaultConfig, updateConfig } from './globalConfig'
import { generateEnum } from './template/enum'
import { generateInterface } from './template/interface'
import { generateService } from './template/service'
import Config from './type/Config'
import { SwaggerConfigType } from './type/SwaggerConfigType'
import checkOpenAPIVersion from './utils/checkOpenAPIVersion'
import { loadRemoteFile } from './utils/loadRemoteFile'

export async function generate(config: Config) {
  const finalConfig = updateConfig(config)
  const { out } = finalConfig

  let swaggerJSON: SwaggerConfigType

  if (finalConfig.url) {
    swaggerJSON = await loadRemoteFile<SwaggerConfigType>(
      'swagger json',
      finalConfig.url
    )

    console.log('openapi: ' + chalk.green(swaggerJSON.openapi))

    checkOpenAPIVersion(swaggerJSON.openapi)

    await initFiles(finalConfig.out ?? defaultConfig.out)

    await createIndexAxiosFile()

    // interface
    const schemasEntries = Object.entries(swaggerJSON.components.schemas)

    for (const [schemaName, schemaValue] of schemasEntries) {
      // normal interface
      createInterfaceFile(
        finalConfig.out,
        schemaName,
        generateInterface(schemaName, schemaValue)
      )

      // enum
      generateEnum(schemaValue).map(({ name, code }) => {
        createInterfaceFile(out, name, code)
      })
    }

    // service
    swaggerJSON.tags.forEach((tag) => {
      createServiceFile(out, tag.name, generateService(tag, swaggerJSON.paths))
    })

    console.log('generated result: ' + chalk.green('success'))
  }
}
