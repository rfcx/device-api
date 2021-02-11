const models = require('../../../modelsTimescale')
import { Deployment, Project, Stream } from '../../types'

export const getDeployments = async (uid: string, opt: {isActive: boolean, limit: number, offset: number} ) => {
    // const query = database.collection('users').doc(uid).collection('deployments').where("isActive", "==", opt.isActive).orderBy("updatedAt", "desc")
    // let allDeployment: FirebaseFirestore.DocumentData[] = [] 
    // try {
    //     const data = await query.get()
    //     data.docs.forEach(dp => {
    //         allDeployment.push(dp.data())
    //     })
    //     return allDeployment
    // } catch(error) {
    //     return Promise.reject(error)
    // }
  }

export const createDeployments = async (uid: string, deployment: Deployment) => {
    // if (!deployment.stream.coreId) { return Promise.reject('Failed on create Deployment') }
    // await setActiveStatusToFalse(uid, deployment.stream.coreId)
    // const query = database.collection('users').doc(uid).collection('deployments')
    // try {
    //     deployment.isActive = true
    //     const result = await query.add(deployment)
    //     if(result) {
    //         return result.id
    //     }
    //     return Promise.reject('Failed on create Deployment')
    // } catch(error) {
    //     return Promise.reject(error)
    // }
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
