import Config from './type/Config'

export const defaultConfig: Required<Config> = {
  url: '',
  out: __dirname + '/services',
  baseURL: '',
  prettierConfig: {},
  requestTemplateUrl:
    'https://raw.githubusercontent.com/toft-tech/swagger-axios-ts-generator/master/src/template/indexAxiosTemplate.ts',
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
