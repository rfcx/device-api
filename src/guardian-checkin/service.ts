import { Transaction } from 'sequelize'
// import { EmptyResultError } from '@rfcx/http-utils'
import { CheckinPayload, GuardianCheckinCreatable } from '../types'
import db from '../common/db/guardian'
import checkinDao from './dao'
import guardianDao from '../guardians/dao'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import GuardianCheckin from './guardian-checkin.model'
import guardianService from '../guardians/service'
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

export async function processCheckin (data: CheckinPayload): Promise<void> {
  return await db.sequelize.transaction(async (transaction: Transaction) => {
    const startTime = dayjs.utc().toDate()
    const guardian = await guardianService.getGuardian(data.guardianId, { transaction })
    // const site = await siteService.getSite(guardian.site.id, { transaction })
    const checkin = await createCheckin(data.checkin, transaction)
    await refreshGuardianMetrics(guardian.id, startTime, startTime, transaction)
    await refreshCheckinMetrics(checkin.id, startTime, transaction)
  })
}

export default { processCheckin }
