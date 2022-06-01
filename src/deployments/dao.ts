import { Transaction, Op } from 'sequelize'
import { DeploymentQuery, DeploymentRequest } from '../types'
import db from '../common/db'
import Deployment from './deployment.model'
import GuardianLog from '../guardian-log/guardian-log.model'

export async function get (id: string): Promise<Deployment | null> {
  return await Deployment.findByPk(id, {
    attributes: {
      exclude: ['createdById', 'createdAt', 'updatedAt', 'deletedAt']
    }
  })
}

export const getDeployments = async (streamIds: string[], options: DeploymentQuery = {}): Promise<Deployment[]> => {
  const where: { isActive?: boolean, streamId: { [Op.in]: string[] } } = {
    streamId: {
      [Op.in]: streamIds
    }
  }

  where.isActive = options.isActive ?? true

  return await Deployment.findAll({
    where,
    limit: options.limit,
    offset: options.offset,
    attributes: {
      exclude: ['createdById', 'createdAt', 'updatedAt', 'deletedAt']
    }
  })
}

export const createDeployment = async (userId: string, deployment: DeploymentRequest): Promise<Deployment> => {
  try {
    const result = await db.sequelize.transaction(async (t: Transaction) => {
      // set active existing deployment that same stream to false
      if (deployment.stream.id != null) {
        await setActiveStatusToFalse(deployment.stream.id, t)
      }
      const deploymentData = {
        id: deployment.deploymentKey,
        deployedAt: deployment.deployedAt,
        deploymentType: deployment.deploymentType,
        isActive: true,
        createdById: userId,
        streamId: deployment.stream.id,
        deviceParameters: JSON.stringify(deployment.deviceParameters)
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
    const result = await db.sequelize.transaction(async (t: Transaction) => {
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

export const getStreamIdById = async (deploymentId: string): Promise<string> => {
  try {
    const result = await Deployment.findOne({ where: { id: deploymentId }, attributes: ['streamId'] })
    if (result != null) {
      return result.streamId
    }
    return await Promise.reject(new Error('Failed on get Deployment'))
  } catch (error) {
    return await Promise.reject(error)
  }
}

async function setActiveStatusToFalse (streamId: string, transaction: any): Promise<void> {
  const result = await Deployment.findAll({ where: { streamId: streamId }, transaction: transaction })
  await Promise.all(result.map(async (dp: any) => {
    await dp.update({ isActive: false }, { transaction: transaction })
  }))
}

export const createGuardianLog = async (guid: string, type: string, body: string): Promise<GuardianLog> => {
  try {
    const log = {
        guardianId: guid,
        type: type,
        body: body
    }
    const result = await GuardianLog.create(log)
    if (result != null) {
      return result
    }
    return await Promise.reject(new Error(`Failed on create log ${type} guardian`))
  } catch (error) {
    return await Promise.reject(error)
  }
}

export default { get, getDeployments, createDeployment, updateDeployment, deleteDeployment, getStreamIdById, createGuardianLog }
