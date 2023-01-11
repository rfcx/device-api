import { Transactionable, Op } from 'sequelize/types'
import { GuardianUpdatable } from '../types'
import Guardian from './guardian.model'

export async function get (id: string, o: Transactionable = {}): Promise<Guardian | null> {
  const transaction = o.transaction
  return await Guardian.findOne({
    where: {
      [Op.or]: {
        id: id,
        guid: id
      }
    },
    transaction
  })
}

export async function update (id: number, data: GuardianUpdatable, o: Transactionable = {}): Promise<void> {
  const transaction = o.transaction
  await Guardian.update(data, { where: { id }, transaction })
}

export default { get, update }
