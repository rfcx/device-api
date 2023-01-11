import { Transactionable } from 'sequelize/types'
import { EmptyResultError } from '@rfcx/http-utils'
import Guardian from './guardian.model'
import dao from './dao'

export async function getGuardian (id: string, o: Transactionable = {}): Promise<Guardian> {
  const transaction = o.transaction
  const guardian = await dao.get(id, { transaction })
  if (guardian === null) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw new EmptyResultError(`Guardian with id "${id}" not found`)
  }
  return guardian
}

export default { getGuardian }
