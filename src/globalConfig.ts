import Config from './type/Config'

export const defaultConfig: Required<Config> = {
  url: '',
  out: __dirname + '/services',
  baseURL: '',
  prettierConfig: {},
}

const globalConfig: Config = {
  ...defaultConfig,
}

export function getConfig() {
  return globalConfig
}

export function updateConfig(othersConfig: Config) {
  Object.assign(globalConfig, othersConfig)

  return globalConfig
}
