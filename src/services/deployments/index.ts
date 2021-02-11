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
    try {
        const result = await models.Deployment.create(deploymentData)
        if(result) {
            return result
        }
        return Promise.reject('Failed on create stream')
    } catch(error) {
        return Promise.reject(error)
    }
}

export const updateDeployment = async (uid: string, docId: string, stream?: Stream | null, project?: Project) => {
    // const query = database.collection('users').doc(uid).collection('deployments').doc(docId)
    // try {
    //     const isExisting = (await query.get()).exists
    //     if(!isExisting) { return Promise.reject('Deployment id not found') }
    //     if (stream) { await query.update({stream: stream, updatedAt: new Date()}) }
    //     if (project) { await query.update({"stream.project": project, updatedAt: new Date()}) }

    //     return Promise.resolve('Success')
    // } catch(error) {
    //     return Promise.reject(error)
    // }
}

export const deleteDeployment = async (uid: string, docId: string) => {
    // const query = database.collection('users').doc(uid).collection('deployments').doc(docId)
    // try {
    //     const isExisting = (await query.get()).exists
    //     if(!isExisting) { return Promise.reject('Deployment id not found') }

    //     const result = await query.delete()
    //     if(result) {
    //         return Promise.resolve('Success')
    //     }
    //     return Promise.reject('Failed on delete')
    // } catch(error) {
    //     return Promise.reject(error)
    // }
}

async function setActiveStatusToFalse(uid: string, streamId: string) {
    // const query = database.collection('users').doc(uid).collection('deployments').where("isActive", "==", true).where("stream.id", "==", streamId)
    // const result = await query.get()
    // await Promise.all(result.docs.map(async (doc) => {
    //     await doc.ref.update({ isActive: false })
    // }))
}
