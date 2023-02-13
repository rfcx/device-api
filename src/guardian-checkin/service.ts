import { Transaction } from 'sequelize'
// import { EmptyResultError } from '@rfcx/http-utils'
import { CheckinPayload, GuardianCheckinCreatable, CheckinAudioPayload } from '../types'
import db from '../common/db/guardian'
import checkinDao from './dao'
import guardianDao from '../guardians/dao'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import GuardianCheckin from './guardian-checkin.model'
import guardianService from '../guardians/service'
import { getUploadPath } from '../common/ingest-service'
import { getFilenameFromPath } from '../common/fs'
import { uploadFile } from '../common/storage'
// import siteService from '../guardian-sites/service'

dayjs.extend(utc)

async function createCheckin (data: GuardianCheckinCreatable, transaction: Transaction): Promise<GuardianCheckin> {
  return await checkinDao.create(data, { transaction })
}

async function refreshGuardianMetrics (id: number, lastCheckIn: Date, lastPing: Date, transaction: Transaction): Promise<void> {
  return await guardianDao.update(id, { lastCheckIn, lastPing }, { transaction })
}

async function refreshCheckinMetrics (id: number, startTime: Date, transaction: Transaction): Promise<void> {
  return await checkinDao.update(id, { requestLatencyApi: Date.now() - startTime.valueOf() }, { transaction })
}

async function uploadAudioFile (audioData: CheckinAudioPayload, stream: string): Promise<void> {
  const filename = getFilenameFromPath(audioData.path)
  const { bucket, path } = await getUploadPath({
    filename,
    filePath: audioData.path,
    stream,
    timestamp: audioData.meta.measuredAt.toISOString(),
    sampleRate: audioData.meta.sampleRate,
    targetBitrate: audioData.meta.bitRate
  })
  await uploadFile(path, audioData.path, bucket)
}

export async function processCheckin (payload: CheckinPayload): Promise<void> {
  return await db.sequelize.transaction(async (transaction: Transaction) => {
    const startTime = dayjs.utc().toDate()
    const guardian = await guardianService.getGuardian(payload.guardian.guid, { transaction })
    // const site = await siteService.getSite(guardian.site.id, { transaction })
    // const checkin = await createCheckin(payload.checkin, transaction)
    if (payload.audio !== null) {
      if (guardian.streamId !== null) {
        await uploadAudioFile(payload.audio, guardian.streamId)
      } else {
        console.error(`stream_id is not set for guardian with id ${guardian.id}. Unable to ingest audio file.`)
      }
    }

    await refreshGuardianMetrics(guardian.id, startTime, startTime, transaction)
    // await refreshCheckinMetrics(checkin.id, startTime, transaction)
  })
}

export default { processCheckin }
