/* eslint-disable @typescript-eslint/no-throw-literal */
import { gunzip } from 'zlib'
import { promisify } from 'util'
// import { CheckinPayload, MqttMessageBuffers } from '../../types'
import { splitBuffer, saveFileBufToDisk, extractAudioFileMeta, extractGuardianMeta } from './utils'
import { parseMqttStrArr } from './utils/parse-mqtt-str-arr'
import { ValidationError } from '@rfcx/http-utils'
import { MqttMessageJson, AuthenticationDecision, MqttMessageProcessResult, CheckinPayload } from '../types'
import guardianDao from '../guardians/dao'
import { expandAbbreviatedFieldNames } from '../guardian-checkin/utils/message/expand-abbr'
import { sha1 } from '../common/hash'

const gunzipAsync = promisify(gunzip)

// async function authenticateGuardian (): Promise<void> {

// }

export const checkGuardianToken = async function (guardianGuid: string, token: string): Promise<boolean> {
  const guardian = await guardianDao.get(guardianGuid)
  if (guardian === null) {
    return false
  }
  return guardian.authTokenHash === sha1(guardian.authTokenSalt + token)
}

export const allowUserPath = async function (username: string, password: string): Promise<AuthenticationDecision> {
  const isTokenCorrect = await checkGuardianToken(username, password)
  return isTokenCorrect ? 'allow' : 'deny'
}

export const allowVhostOrResourcePath = async function (guardianGuid: string): Promise<AuthenticationDecision> {
  const guardian = await guardianDao.get(guardianGuid)
  return guardian !== null ? 'allow' : 'deny'
}

export const allowTopicPath = async function (guardianGuid: string, permission: 'read' | 'write', routingKey: string): Promise<AuthenticationDecision> {
  const guardian = await guardianDao.get(guardianGuid)
  if (guardian === null ||
      (permission === 'read' && routingKey !== `grd.${guardianGuid}.cmd`) ||
      (permission === 'write' && ![`grd.${guardianGuid}.chk`, `grd.${guardianGuid}.png`].includes(routingKey))) {
    return 'deny'
  }
  return 'allow'
}

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

export const parseMessage = async function (data: Buffer): Promise<CheckinPayload> {
  const buffers = splitBuffer(data)
  let json = await decodeData(buffers.json) as MqttMessageJson
  json = expandAbbreviatedFieldNames(json)
  const guardianMeta = await extractGuardianMeta(json)
  const result: CheckinPayload = {
    guardian: {
      guid: json.guardian.guid,
      token: json.guardian.token,
      meta: guardianMeta
    },
    audio: null
  }
  if (buffers.audio !== null) {
    const audioMetaArr = parseMqttStrArr(json.audio)
    const audioFilePath = await saveFileToDisk(buffers.audio, audioMetaArr)
    const audioMeta = await extractAudioFileMeta(audioMetaArr[0], audioFilePath)
    result.audio = {
      meta: audioMeta,
      path: audioFilePath
    }
  }
  return result
}

export const processMessage = async function (data: Buffer, messageId: string): Promise<MqttMessageProcessResult> {
  // TODO: guardian authentication is needed here
  await parseMessage(data)
  return { gzip: Buffer.from(''), guardianGuid: '' }
}

export default { parseMessage, processMessage }
