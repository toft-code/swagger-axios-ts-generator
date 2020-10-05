import Axios from 'axios'
import chalk from 'chalk'
import ora from 'ora'
import { SwaggerConfigType } from './type/SwaggerConfigType'

async function load(url: string) {
  const spinner = ora('Loading remote config ...').start()

  const { data } = await Axios.get<SwaggerConfigType>(url)

  spinner.stop()

  return data
}

function printConfigInfo(config: SwaggerConfigType) {
  console.log(chalk.green('openapi: ' + config.openapi))

  Object.keys(config.paths).forEach((key) => console.log(key))
}

export default async function loadRemoteConfig(url: string) {
  let res = null

  if (url) {
    res = await load(url)

    printConfigInfo(res)
  }

  return res
}
