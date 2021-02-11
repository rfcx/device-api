const models = require('../../../modelsTimescale')
import { Project } from '../../types'

export const createProject = async (uid: string, project: Project) => {
    if (!project.id) { return Promise.reject('Failed on create project') }
    const projectData = {
        id: project.id,
        name: project.name,
        color: project.color,
        created_by_id: uid
    }
    try {
        const result = await models.Project.create(projectData)
        if(result) {
            return result.id
        }
        return Promise.reject('Failed on create project')
    } catch(error) {
        return Promise.reject(error)
    }
}

export const updateProject = async (uid: string, project: Project) => {
    if (!project.id) { return Promise.reject('Failed on update project') }
    try {
        const result = await models.Project.update(project, { where: { id: project.id, created_by_id: uid }})
        if(result) {
            return Promise.resolve('Success')
        }
        return Promise.reject('Failed on create project')
    } catch(error) {
        return Promise.reject(error)
    }
}
