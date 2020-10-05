import Axios from 'axios'
import chalk from 'chalk'
import ora from 'ora'
import { SwaggerConfigType } from './type/SwaggerConfigType'

async function load(url: string): Promise<SwaggerConfigType> {
  const spinner = ora('Loading remote config ...').start()

  try {
    const { data } = await Axios.get<SwaggerConfigType>(url)

    spinner.stop()

    return data
  } catch (e) {
    throw new Error('load remote config error')
  }
}

// function printConfigInfo(config: SwaggerConfigType) {
//   Object.keys(config.paths).forEach((key) => console.log(key))
// }

export default async function loadRemoteConfig(
  url: string
): Promise<SwaggerConfigType> {
  let res = await load(url)

  // printConfigInfo(res)

  return res
}
