import { createFiles } from './files'
import loadRemoteConfig from './loadRemoteConfig'

type Config = {
  url?: string
}

const defaultConfig = {
  url: '',
}

export async function generate(config: Config) {
  config = Object.assign(defaultConfig, config)

  if (config.url) {
    await loadRemoteConfig(config.url)
  }

  createFiles()
}
