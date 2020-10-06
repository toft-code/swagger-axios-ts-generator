import chalk from 'chalk'
import { createFiles } from './files'
import { defaultConfig, updateConfig } from './globalConfig'
import Config from './type/Config'
import { SwaggerConfigType } from './type/SwaggerConfigType'
import checkOpenAPIVersion from './utils/checkOpenAPIVersion'
import { loadRemoteFile } from './utils/loadRemoteFile'

export async function generate(config: Config) {
  const finalConfig = updateConfig(config)

  let swaggerJSON = null

  if (finalConfig.url) {
    swaggerJSON = await loadRemoteFile<SwaggerConfigType>(
      'swagger json',
      finalConfig.url
    )

    console.log('openapi: ' + chalk.green(swaggerJSON.openapi))

    checkOpenAPIVersion(swaggerJSON.openapi)

    createFiles(finalConfig.out ?? defaultConfig.out, swaggerJSON)

    console.log('generated result: ' + chalk.green('success'))
  }
}
