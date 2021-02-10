import { Project } from '../../types'

export const createProject = async (uid: string, project: Project, projectId: string | null) => {
    // if (!projectId) { return Promise.reject('Failed on create project') }
    // const query = database.collection('users').doc(uid).collection('projects').doc(projectId)
    // try {
    //     const result = await query.set(project)
    //     if(result) {
    //         return Promise.resolve('Success')
    //     }
    //     return Promise.reject('Failed on create project')
    // } catch(error) {
    //     return Promise.reject(error)
    // }
}

export const updateProject = async (uid: string, project: Project) => {
    // if (!project.coreId) { return Promise.reject('Failed on update project') }
    // const projectQuery = database.collection('users').doc(uid).collection('projects').doc(project.coreId)
    // try {
    //     const projectResult = await projectQuery.update(project)
    //     if(projectResult) {
    //         const streamQuery = database.collection('users').doc(uid).collection('streams').where("project.coreId", "==", project.coreId)
    //         const streamResult = await streamQuery.get()
    //         await Promise.all(streamResult.docs.map(async (doc) => {
    //             await doc.ref.update({ project: project })
    //         }))

    //         return Promise.resolve('Success')
    //     }
    //     return Promise.reject('Failed on update project')
    // } catch(error) {
    //     return Promise.reject(error)
    // }
}
