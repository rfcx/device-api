import config from '../../config'
import { existsSync, mkdirSync, readFile } from 'fs'
import path from 'path'
import { promisify } from 'util'

export const readFileAsync = promisify(readFile)

export const ensureTmpDirExists = async function (): Promise<void> {
  if (!existsSync(config.CACHE_DIRECTORY)) {
    mkdirSync(config.CACHE_DIRECTORY)
  }
  const uploads = path.join(config.CACHE_DIRECTORY, 'uploads')
  if (!existsSync(uploads)) {
    mkdirSync(uploads)
  }
}

export const getFilenameFromPath = function (filePath: string): string {
  return path.basename(filePath)
}
