import Config from './type/Config'

export const defaultConfig: Required<Config> = {
  url: '',
  out: './services',
  baseURL: '',
  prettierConfig: {},
  operationIdForeach: (operationId) => operationId,
  requestTemplateUrl:
    'https://raw.githubusercontent.com/toft-tech/swagger-axios-ts-generator/master/src/template/indexAxiosTemplate.ts',
}

const globalConfig: Required<Config> = {
  ...defaultConfig,
}

export function getConfig() {
  return globalConfig
}

export function updateConfig(othersConfig: Config) {
  Object.assign(globalConfig, othersConfig)

  return globalConfig
}
