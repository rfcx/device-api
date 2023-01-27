/* eslint-disable @typescript-eslint/no-throw-literal */
import path from 'path'
import { writeFile } from 'fs/promises'
import config from '../../config'
import { ValidationError } from '@rfcx/http-utils'
import { MqttMessageBuffers } from '../../types'
import { randomString, getFileSha1 } from '../../common/hash'
import { gunzip } from 'zlib'
import { promisify } from 'util'

const gunzipAsync = promisify(gunzip)

export const splitBuffer = function (data: Buffer): MqttMessageBuffers {
  const metaLength = 12

  const jsonBlobStart = 0
  const jsonBlobLength = parseInt(data.toString('utf8', jsonBlobStart, jsonBlobStart + metaLength))
  if (isNaN(jsonBlobLength)) {
    throw new ValidationError('Invalid mqtt message: buffer length')
  }

  const audioFileStart = metaLength + jsonBlobLength
  const audioFileLength = parseInt(data.toString('utf8', audioFileStart, audioFileStart + metaLength))

  const screenShotStart = audioFileStart + metaLength + audioFileLength
  const screenShotFileLength = parseInt(data.toString('utf8', screenShotStart, screenShotStart + metaLength))

  const logFileStart = screenShotStart + metaLength + screenShotFileLength
  const logFileLength = parseInt(data.toString('utf8', logFileStart, logFileStart + metaLength))

  const json = data.slice(metaLength, audioFileStart)
  const audio = !isNaN(audioFileLength) ? data.slice(audioFileStart + metaLength, audioFileStart + metaLength + audioFileLength) : null
  const screenshot = !isNaN(screenShotFileLength) ? data.slice(screenShotStart + metaLength, screenShotStart + metaLength + screenShotFileLength) : null
  const log = !isNaN(logFileLength) ? data.slice(logFileStart + metaLength, logFileStart + metaLength + logFileLength) : null

  return { json, audio, screenshot, log }
}

export const saveFileBufToDisk = async function (buf: Buffer, isGZipped: boolean, extension: string, sha1: string): Promise<string> {
  const filename = `${randomString(36)}.${extension}`
  const tmpPath = path.join(config.CACHE_DIRECTORY, 'uploads', filename)

  if (isGZipped) {
    buf = await gunzipAsync(buf)
  }
  await writeFile(tmpPath, buf, 'binary')
  const fileSha1 = await getFileSha1(tmpPath)
  if (sha1 !== fileSha1) {
    throw new ValidationError(`File checksum mismatch: ${sha1} vs ${fileSha1}`)
  }
  return tmpPath
}
