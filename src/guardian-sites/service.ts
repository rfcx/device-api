import { Transactionable } from 'sequelize'
import { EmptyResultError } from '@rfcx/http-utils'
import GuardianSite from './guardian-site.model'
import dao from './dao'

export async function getSite (id: string, o: Transactionable = {}): Promise<GuardianSite> {
  const transaction = o.transaction
  const site = await dao.get(id, { transaction })
  if (site === null) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw new EmptyResultError(`GuardianSite with id "${id}" not found`)
  }
  return site
}

export default { getSite }
