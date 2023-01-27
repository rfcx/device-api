import { Transactionable, Op } from 'sequelize'
import GuardianSite from './guardian-site.model'

export async function get (id: string, o: Transactionable = {}): Promise<GuardianSite | null> {
  const transaction = o.transaction
  return await GuardianSite.findOne({
    where: {
      [Op.or]: {
        id: id,
        guid: id
      }
    },
    transaction
  })
}

export default { get }
