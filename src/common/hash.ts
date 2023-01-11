import { readFileAsync } from './fs'
import { createHash } from 'crypto'
import csprng from 'csprng'

export const randomHash = (bits: number): string => {
  return csprng(bits, 36)
}

export const randomString = (length: number): string => {
  return randomHash(320).substr(0, length)
}

export const sha1 = function (data: any): string {
  return createHash('sha1').update(data).digest('hex')
}

export const getFileSha1 = async function (filePath: string): Promise<string> {
  const buf = await readFileAsync(filePath)
  return sha1(buf)
}
