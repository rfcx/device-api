/* eslint @typescript-eslint/no-var-requires: "off" */
import { Deployment } from '../../types'
import { randomString } from '../../utils/misc/hash'
import { Transaction } from 'sequelize'
const models = require('../../../models')

export const getDeployments = async (uid: string, opt: { isActive: boolean, limit: number, offset: number }): Promise<any> => {
  try {
    const result = await models.Deployment.findAll({
      where: {
        created_by_id: uid,
        is_active: opt.isActive
      },
      limit: opt.limit,
      offset: opt.offset,
      attributes: {
        exclude: ['is_active', 'created_by_id']
      }
    })

    if (result != null) {
      return result
    }
    return await Promise.reject(new Error('Failed on get stream'))
  } catch (error) {
    return await Promise.reject(error)
  }
}

export const createDeployments = async (uid: string, deployment: Deployment): Promise<any> => {
  if (deployment.stream.id == null) { return await Promise.reject(new Error('Failed on create Deployment')) }
  try {
    return models.sequelize.transaction(async (t: Transaction) => {
      // set active existing deployment that same stream to false
      await setActiveStatusToFalse(uid, deployment.stream.id, t)
      const deploymentData = {
        id: randomString(12),
        created_at: deployment.createdAt,
        deployed_at: deployment.updatedAt,
        updated_at: deployment.updatedAt,
        deleted_at: deployment.deletedAt ?? null,
        deployment_key: deployment.deploymentKey,
        device: deployment.device,
        is_active: true,
        created_by_id: uid,
        stream_id: deployment.stream.id
      }
      const result = await models.Deployment.create(deploymentData, { transaction: t })
      if (result != null) {
        return result
      }
      return await Promise.reject(new Error('Failed on create stream'))
    })
  } catch (error) {
    return await Promise.reject(error)
  }
}

export const deleteDeployment = async (uid: string, deploymentId: string): Promise<any> => {
  try {
    const result = await models.Deployment.destroy({ where: { id: deploymentId, created_by_id: uid } })
    if (result != null) {
      return await Promise.resolve('Delete Success')
    }
  } catch (error) {
    return await Promise.reject(error)
  }
}

async function setActiveStatusToFalse (uid: string, streamId: string, transaction: any): Promise<void> {
  const result = await models.Deployment.findAll({ where: { created_by_id: uid, stream_id: streamId } }, { transaction: transaction })
  await Promise.all(result.map(async (dp: any) => {
    await dp.update({ is_active: false }, { transaction: transaction })
  }))
}
