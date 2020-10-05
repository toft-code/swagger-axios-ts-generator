import fs from 'fs-extra'

const defaultRootDir = __dirname + '/services'

export function createFiles(rootDir: string = defaultRootDir) {
  fs.removeSync(rootDir)
  fs.mkdirSync(rootDir)
  fs.writeFileSync(rootDir + '/index2.ts', 'test')
}
