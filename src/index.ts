import { AxiosError } from 'axios'
import chalk from 'chalk'
import {
  initFiles,
  createIndexAxiosFile,
  createInterfaceFile,
  createServiceFile,
  loadRemoteFile,
} from './files'
import { updateConfig } from './globalConfig'
import { generateEnum } from './template/enum'
import { generateInterface } from './template/interface'
import { generateService } from './template/service'
import Config from './type/Config'
import { SwaggerConfigType } from './type/SwaggerConfigType'
import checkOpenAPIVersion from './utils/checkOpenAPIVersion'

export async function generate(config: Config) {
  const finalConfig = updateConfig(config)

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
      generateEnum(schemaName, schemaValue).map(({ name, code }) => {
        createInterfaceFile(name, code)
      })
    }

    // get all tags
    const allPathTags = new Set<string>()
    Object.keys(swaggerJSON.paths).forEach((key) => {
      const pathDefinition = swaggerJSON.paths[key]

      Object.keys(pathDefinition).forEach((key) => {
        allPathTags.add(pathDefinition[key].tags[0])
      })
    })

    // merge all tags
    const tags: { name: string; description: string }[] = []
    allPathTags.forEach((tag) => {
      const result = swaggerJSON.tags?.find((tagDefinition) => {
        return tagDefinition.name === tag
      })

      if (result) {
        tags.push(result)
      } else {
        tags.push({ name: tag, description: tag })
      }
    })

    // service
    tags.forEach((tag) => {
      createServiceFile(tag.name, generateService(tag, swaggerJSON.paths))
    })

    console.log('generated result: ' + chalk.green('success'))
  }
}

export default generate
