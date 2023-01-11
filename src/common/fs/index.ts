import config from '../../config'
import { promisify } from 'util'
import { existsSync, mkdirSync, writeFile, readFile, unlink } from 'fs'
import path from 'path'

export const writeFileAsync = promisify(writeFile)
export const readFileAsync = promisify(readFile)
export const unlinkAsync = promisify(unlink)

export const ensureTmpDirExists = async function (): Promise<void> {
  if (!existsSync(config.CACHE_DIRECTORY)) {
    mkdirSync(config.CACHE_DIRECTORY)
  }
  const uploads = path.join(config.CACHE_DIRECTORY, 'uploads')
  if (!existsSync(uploads)) {
    mkdirSync(uploads)
  }
}
