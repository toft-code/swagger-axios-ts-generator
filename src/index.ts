import chalk from 'chalk'
import { createFiles } from './files'
import loadRemoteConfig from './loadRemoteConfig'
import Config from './type/Config'
import checkOpenAPIVersion from './utils/checkOpenAPIVersion'

const defaultConfig = {
  url: '',
  out: __dirname + '/services',
}

export async function generate(config: Config) {
  const finalConfig = Object.assign(defaultConfig, config)

  let swaggerJSON = null

  // if (finalConfig.url) {
  swaggerJSON = await loadRemoteConfig(finalConfig.url)
  // }

  console.log('openapi: ' + chalk.green(swaggerJSON.openapi))

  checkOpenAPIVersion(swaggerJSON.openapi)

  createFiles(finalConfig.out, swaggerJSON)

  console.log('generated result: ' + chalk.green('success'))
}
