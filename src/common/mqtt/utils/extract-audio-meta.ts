import { stat, unlink } from 'fs/promises'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { codecToMime, transcodeToFile } from '../../audio'
import { promisify } from 'util'
import { exec } from 'child_process'
import config from '../../../config'
import { ValidationError } from '@rfcx/http-utils'
import { AudioFileMeta } from '../../types'

const execAsync = promisify(exec)

dayjs.extend(utc)

export const extractAudioFileMeta = async function (metaArr: string[], filePath: string): Promise<AudioFileMeta> {
  const fileStats = await stat(filePath)
  const sampleRate = parseInt(metaArr[4])

  const wavFilePath = await transcodeToFile('wav', {
    sourceFilePath: filePath,
    sampleRate: sampleRate
  })

  const soxCmd = `${config.SOX_PATH}i -s ${wavFilePath}`
  const { stdout } = await execAsync(soxCmd)
  if (stdout === null) {
    throw new ValidationError('Can not get sample count for audio file') // eslint-disable-line @typescript-eslint/no-throw-literal
  }
  const meta: AudioFileMeta = {
    size: fileStats.size,
    measuredAt: dayjs.utc(parseInt(metaArr[1])),
    sha1CheckSum: metaArr[3],
    sampleRate: sampleRate,
    bitRate: parseInt(metaArr[5]),
    audioCodec: metaArr[6],
    fileExtension: metaArr[2],
    isVbr: (metaArr[7].toLowerCase() === 'vbr'),
    encodeDuration: parseInt(metaArr[8]),
    mimeType: codecToMime(metaArr[6]),
    captureSampleCount: parseInt((stdout.trim()))
  }
  await unlink(wavFilePath)
  return meta
  // return new Promise(function (resolve, reject) {
  //   try {
  //     fs.stat(checkInObj.audio.filePath, function (statErr, fileStat) {
  //       if (statErr) { reject(statErr) }

  //       checkInObj.audio.meta = {
  //         size: fileStat.size,
  //         measuredAt: new Date(parseInt(checkInObj.audio.metaArr[1])),
  //         sha1CheckSum: checkInObj.audio.metaArr[3],
  //         sampleRate: parseInt(checkInObj.audio.metaArr[4]),
  //         bitRate: parseInt(checkInObj.audio.metaArr[5]),
  //         audioCodec: checkInObj.audio.metaArr[6],
  //         fileExtension: checkInObj.audio.metaArr[2],
  //         isVbr: (checkInObj.audio.metaArr[7].toLowerCase() === 'vbr'),
  //         encodeDuration: parseInt(checkInObj.audio.metaArr[8]),
  //         mimeType: assetUtils.mimeTypeFromAudioCodec(checkInObj.audio.metaArr[6]),
  //         s3Path: assetUtils.getGuardianAssetStoragePath('audio', new Date(parseInt(checkInObj.audio.metaArr[1])), checkInObj.json.guardian.guid, checkInObj.audio.metaArr[2])
  //       }

  //       audioUtils.transcodeToFile('wav', {
  //         sourceFilePath: checkInObj.audio.filePath,
  //         sampleRate: checkInObj.audio.meta.sampleRate
  //       })
  //         .then(function (wavFilePath) {
  //           fs.stat(wavFilePath, function (wavStatErr, wavFileStat) {
  //             if (wavStatErr !== null) { reject(wavStatErr) }

  //             exec(process.env.SOX_PATH + 'i -s ' + wavFilePath, function (err, stdout, stderr) {
  //               if (stderr.trim().length > 0) { console.error(stderr) }
  //               if (err) { console.error(err); reject(err) }

  //               checkInObj.audio.meta.captureSampleCount = parseInt(stdout.trim())
  //               assetUtils.deleteLocalFileFromFileSystem(wavFilePath)
  //               resolve(checkInObj)
  //             })
  //           })
  //         })
  //     })
  //   } catch (err) {
  //     console.error('ExtractAudioFileMeta: common error', err)
  //     reject(err)
  //   }
  // })
}
