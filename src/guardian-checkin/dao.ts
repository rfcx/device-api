import { Transactionable } from 'sequelize'
import { GuardianCheckinCreatable, GuardianCheckinUpdatable } from '../types'
import GuardianCheckin from './guardian-checkin.model'

export async function create (data: GuardianCheckinCreatable, o: Transactionable = {}): Promise<GuardianCheckin> {
  const transaction = o.transaction
  return await GuardianCheckin.create(data, { transaction })
}

export async function update (id: number, data: GuardianCheckinUpdatable, o: Transactionable = {}): Promise<void> {
  const transaction = o.transaction
  await GuardianCheckin.update(data, { where: { id }, transaction })
}

export default { create, update }
