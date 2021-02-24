import { Transaction } from 'sequelize'
import { DeploymentResponse } from '../types'
import { sequelize } from '../common/db'
import Deployment from './deployment.model'

export async function get (id: string): Promise<Deployment | null> {
  return await Deployment.findByPk(id)
}

export const getDeployments = async (uid: string, options: { isActive?: boolean, limit?: number, offset?: number }): Promise<Deployment[]> => {
  const where: { createdById: string, isActive?: boolean } = {
    createdById: uid
  }
  if (options.isActive !== undefined) {
    where.isActive = options.isActive
  }

  return await Deployment.findAll({
    where,
    limit: options.limit ?? 100,
    offset: options.offset ?? 0,
    attributes: {
      exclude: ['isActive', 'createdById', 'createdAt', 'updatedAt', 'deletedAt']
    }
  })
}

export const createDeployment = async (uid: string, deployment: DeploymentResponse): Promise<Deployment> => {
  if (deployment.stream.id == null) { return await Promise.reject(new Error('Failed on create Deployment')) }
  try {
    const result = await sequelize.transaction(async (t: Transaction) => {
      // set active existing deployment that same stream to false
      await setActiveStatusToFalse(uid, deployment.stream.id ?? '', t)
      const deploymentData = {
        id: deployment.deploymentKey,
        deployedAt: deployment.deployedAt,
        deploymentType: deployment.deploymentType,
        isActive: true,
        createdById: uid,
        streamId: deployment.stream.id
      }
      const result = await Deployment.create(deploymentData, { transaction: t })
      if (result != null) {
        return result
      }
      return await Promise.reject(new Error('Failed on create Deployment'))
    })
    return result
  } catch (error) {
    return await Promise.reject(error)
  }
}

export const updateDeployment = async (uid: string, deploymentId: string): Promise<string> => {
  try {
    const result = await Deployment.update({ updatedAt: new Date() }, { where: { id: deploymentId, createdById: uid } })
    if (result != null) {
      return await Promise.resolve('Update Success')
    }
    return await Promise.reject(new Error('Failed on update Deployment'))
  } catch (error) {
    return await Promise.reject(error)
  }
}

export const deleteDeployment = async (uid: string, deploymentId: string): Promise<string> => {
  try {
    const result = await sequelize.transaction(async (t: Transaction) => {
      await Deployment.update({ isActive: false }, { where: { id: deploymentId, createdById: uid }, transaction: t })
      const result = await Deployment.destroy({ where: { id: deploymentId, createdById: uid }, transaction: t })
      if (result != null) {
        return await Promise.resolve('Delete Success')
      }
      return await Promise.reject(new Error('Failed on delete Deployment'))
    })
    return result
  } catch (error) {
    return await Promise.reject(error)
  }
}

export const getStreamIdById = async (uid: string, deploymentId: string): Promise<string> => {
  try {
    const result = await Deployment.findOne({ where: { id: deploymentId, createdById: uid }, attributes: ['streamId'] })
    if (result != null) {
      return result.streamId
    }
    return await Promise.reject(new Error('Failed on get Deployment'))
  } catch (error) {
    return await Promise.reject(error)
  }
}

async function setActiveStatusToFalse (uid: string, streamId: string, transaction: any): Promise<void> {
  const result = await Deployment.findAll({ where: { createdById: uid, streamId: streamId }, transaction: transaction })
  await Promise.all(result.map(async (dp: any) => {
    await dp.update({ isActive: false }, { transaction: transaction })
  }))
}

export default { get, getDeployments, createDeployment, updateDeployment, deleteDeployment, getStreamIdById }
