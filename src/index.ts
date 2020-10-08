import { AxiosError } from 'axios'
import chalk from 'chalk'
import {
  initFiles,
  createIndexAxiosFile,
  createInterfaceFile,
  createServiceFile,
  loadRemoteFile,
} from './files'
import { defaultConfig, updateConfig } from './globalConfig'
import { generateEnum } from './template/enum'
import { generateInterface } from './template/interface'
import { generateService } from './template/service'
import Config from './type/Config'
import { SwaggerConfigType } from './type/SwaggerConfigType'
import checkOpenAPIVersion from './utils/checkOpenAPIVersion'

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

    initFiles()

    await createIndexAxiosFile().catch((e: AxiosError) => {
      console.log(
        'load template file error:',
        'copy',
        chalk.red(e.config.url),
        'to',
        'index.ts'
      )
      console.log('# you can manual create it. #')
    })

    // interface
    const schemasEntries = Object.entries(swaggerJSON.components.schemas)

    for (const [schemaName, schemaValue] of schemasEntries) {
      // normal interface
      createInterfaceFile(
        schemaName,
        generateInterface(schemaName, schemaValue)
      )

      // enum
      generateEnum(schemaValue).map(({ name, code }) => {
        createInterfaceFile(name, code)
      })
    }

    // service
    swaggerJSON.tags.forEach((tag) => {
      createServiceFile(tag.name, generateService(tag, swaggerJSON.paths))
    })

    console.log('generated result: ' + chalk.green('success'))
  }
}
