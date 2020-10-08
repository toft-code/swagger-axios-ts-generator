import fs from 'fs-extra'
import path from 'path'
import { getConfig } from './globalConfig'
import { loadRemoteFile } from './utils/loadRemoteFile'
import pascalCase from './utils/pascalCase'

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
