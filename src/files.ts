import fs from 'fs-extra'
import path from 'path'
import { getConfig } from './globalConfig'
import pascalCase from './utils/pascalCase'
import Axios from 'axios'
import ora from 'ora'

const INDEX_FILE = 'index.ts'

export function writeFile(file: string, data: any) {
  return fs.writeFileSync(path.resolve(getConfig().out, file), data)
}

export function readFile(file: string) {
  return fs.readFileSync(path.resolve(getConfig().out, file), {
    encoding: 'utf8',
  })
}

export function createInterfaceFile(name: string, code: string) {
  return writeFile(`interfaces/${pascalCase(name)}.ts`, code)
}

export function createServiceFile(name: string, code: string) {
  return writeFile(
    `${pascalCase(name)}${getConfig().serviceNameSuffix}.ts`,
    code
  )
}

export async function createIndexAxiosFile() {
  const { requestTemplateUrl } = getConfig()

  if (requestTemplateUrl && !indexFileExist()) {
    const code = await loadRemoteFile('request template', requestTemplateUrl)
    writeFile(INDEX_FILE, code)
  }
}

export function indexFileExist() {
  return fs.existsSync(path.resolve(getConfig().out, INDEX_FILE))
}

export function initFiles() {
  let indexFileContent
  const rootDir = path.resolve(getConfig().out)

  // save index file
  if (indexFileExist()) {
    indexFileContent = readFile(INDEX_FILE)
  }

  fs.removeSync(rootDir)
  fs.mkdirSync(rootDir)
  fs.mkdirSync(rootDir + '/interfaces')

  // restore index file
  if (indexFileContent) {
    writeFile(INDEX_FILE, indexFileContent)
  }
}

export async function loadRemoteFile<T>(name: string, url: string): Promise<T> {
  const spinner = ora(`Loading remote ${name} ...`).start()

  const { data } = await Axios.get<T>(url).finally(() => {
    spinner.stop()
  })

  return data
}
