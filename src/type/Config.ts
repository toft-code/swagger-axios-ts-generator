export default interface Config {
  /** swagger json file url */
  url?: string

  /** files out path */
  out?: string

  /** api baseURL */
  baseURL?: string

  /** prettier config */
  prettierConfig?: any

  /** request template file url */
  requestTemplateUrl?: string

  /** foreach operationId */
  operationIdForeach?: (operationId: string) => string

  /** service file name suffix */
  serviceNameSuffix?: string

  /** direct return data */
  isDirectReturnData?: boolean
}
