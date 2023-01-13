import config from '../../config'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'

export const ensureTmpDirExists = async function (): Promise<void> {
  if (!existsSync(config.CACHE_DIRECTORY)) {
    mkdirSync(config.CACHE_DIRECTORY)
  }
  const uploads = path.join(config.CACHE_DIRECTORY, 'uploads')
  if (!existsSync(uploads)) {
    mkdirSync(uploads)
  }
}
