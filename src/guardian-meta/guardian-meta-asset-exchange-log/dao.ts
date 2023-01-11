import { Transactionable } from 'sequelize'
import GuardianMetaAssetExchangeLog from './guardian-meta-asset-exchange-log.model'

export async function create (data: GuardianMetaAssetExchangeLog, o: Transactionable = {}): Promise<GuardianMetaAssetExchangeLog> {
  const transaction = o.transaction
  return await GuardianMetaAssetExchangeLog.create(data, { transaction })
}

export default { create }
