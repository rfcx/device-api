const models = require('../../../modelsTimescale')
import { Deployment, Project, Stream } from '../../types'
import { randomString } from '../../utils/misc/hash'

const streamBaseInclude = [
    {
      model: models.User,
      as: 'created_by',
      attributes: models.User.attributes.full
    },
    {
      model: models.Stream,
      as: 'stream',
      attributes: models.Stream.attributes.lite,
      include: {
          model: models.Project,
          as: 'project',
          attributes: models.Project.attributes.lite,
      }
    }
  ]

export const getDeployments = async (uid: string, opt: {isActive: boolean, limit: number, offset: number, joinRelations: boolean} ) => {
    return await models.Deployment.findAll({
        where: {
            created_by_id: uid,
            is_active: opt.isActive
        },
        limit: opt.limit,
        offset: opt.offset,
        attributes: {
            exclude: ['is_active', 'created_by_id', 'stream_id']
        },
        include: opt.joinRelations ? streamBaseInclude : [],
     })
  }

export const createDeployments = async (uid: string, deployment: Deployment) => {
    if (!deployment.stream.id) { return Promise.reject('Failed on create Deployment') }
    try {
        return models.sequelize.transaction( async(t) => {
            // set active existing deployment that same stream to false
            await setActiveStatusToFalse(uid, deployment.stream.id, t)
            const deploymentData = {
                id: randomString(12),
                created_at: deployment.createdAt,
                deployed_at: deployment.updatedAt,
                updated_at: deployment.updatedAt,
                deleted_at: deployment.deletedAt || null,
                deployment_key: deployment.deploymentKey,
                device: deployment.device,
                is_active: true,
                created_by_id: uid,
                stream_id: deployment.stream.id
            }
            const result = await models.Deployment.create(deploymentData, { transaction: t })
            if(result) {
                return result
            }
            return Promise.reject('Failed on create stream')
        })
    } catch(error) {
        return Promise.reject(error)
    }
}

export const deleteDeployment = async (uid: string, deploymentId: string) => {
    try {
        const result = await models.Deployment.destroy({ where:{ id: deploymentId, created_by_id: uid } })
        if(result) {
            return Promise.resolve('Delete Success')
        }
    } catch(error) {
        return Promise.reject(error)
    }
}

async function setActiveStatusToFalse(uid: string, streamId: string, transaction: any) {
    const result = await models.Deployment.findAll( { where: { created_by_id: uid, stream_id: streamId } }, { transaction: transaction })
    await Promise.all(result.map(async (dp: any) => {
        await dp.update({ is_active: false }, { transaction: transaction })
    }))
}
