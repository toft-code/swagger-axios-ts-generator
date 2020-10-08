import fs from 'fs-extra'
import path from 'path'
import { getConfig } from './globalConfig'
import pascalCase from './utils/pascalCase'
import Axios from 'axios'
import ora from 'ora'

export function writeFile(file: string, data: any) {
  return fs.writeFile(path.join(__dirname, file), data)
}

export function createInterfaceFile(
  rootDir: string,
  name: string,
  code: string
) {
  return writeFile(rootDir + `/interfaces/${pascalCase(name)}.ts`, code)
}

export function createServiceFile(rootDir: string, name: string, code: string) {
  return writeFile(rootDir + `/${pascalCase(name)}.ts`, code)
}

export async function createIndexAxiosFile() {
  const { requestTemplateUrl, out } = getConfig()

  if (requestTemplateUrl) {
    const code = await loadRemoteFile('request template', requestTemplateUrl)
    writeFile(out + `/index.ts`, code)
  }
}

export async function initFiles(rootDir: string) {
  rootDir = path.join(__dirname, rootDir)
  fs.removeSync(rootDir)
  fs.mkdirSync(rootDir)
  fs.mkdirSync(rootDir + '/interfaces')
}

export async function loadRemoteFile<T>(name: string, url: string): Promise<T> {
  const spinner = ora(`Loading remote ${name} ...`).start()

  const { data } = await Axios.get<T>(url)

  spinner.stop()

  return data
}
