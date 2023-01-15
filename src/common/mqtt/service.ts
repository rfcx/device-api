/* eslint-disable @typescript-eslint/no-throw-literal */
import { gunzip } from 'zlib'
import { promisify } from 'util'
// import { CheckinPayload, MqttMessageBuffers } from '../../types'
import { splitBuffer, saveFileBufToDisk, extractAudioFileMeta, extractGuardianMeta } from './utils'
import { parseMqttStrArr } from './utils/parse-mqtt-str-arr'
import { ValidationError } from '@rfcx/http-utils'
import { MqttMessageJson } from './types'

const gunzipAsync = promisify(gunzip)

// async function authenticateGuardian (): Promise<void> {

// }

export const decodeData = async function (buf: Buffer): Promise<object> {
  if (!Buffer.isBuffer(buf)) {
    throw new ValidationError('Invalid mqtt message: data is not a Buffer')
  }
  const decodedBuf = await gunzipAsync(buf)
  const json = JSON.parse(decodedBuf.toString('utf-8'))
  return json
}

export const saveFileToDisk = async function (buf: Buffer, meta: string[][]): Promise<string> {
  return await saveFileBufToDisk(buf, true, meta[0][2], meta[0][3])
}

// export const parseMessage = async function (data: Buffer): CheckinPayload {
export const parseMessage = async function (data: Buffer): Promise<any> {
  const buffers = splitBuffer(data)
  const json = await decodeData(buffers.json) as MqttMessageJson
  if (buffers.audio !== null) {
    const audioMetaArr = parseMqttStrArr(json.audio)
    const audioFilePath = await saveFileToDisk(buffers.audio, audioMetaArr)
    const audioMeta = await extractAudioFileMeta(audioMetaArr[0], audioFilePath)
  }
  const guardianMeta = await extractGuardianMeta(json)
  return json
}

export default { parseMessage }
