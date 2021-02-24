import dao from './dao'
import assetDao from '../assets/dao'
import { uploadFile } from '../common/amazon'
import { generateFileName, fileNameToPath } from '../common/misc/file'
import { DeploymentResponse, ProjectResponse } from 'src/types'
import * as api from '../common/core-api'
import Deployment from './deployment.model'

export const createDeployment = async (uid: string, token: string, deployment: DeploymentResponse): Promise<Deployment> => {
  const stream = deployment.stream
  const project = stream.project as ProjectResponse ?? null

  let projectId = project?.id ?? null
  let streamId = stream?.id ?? null

  try {
    if (streamId == null) {
      // new project
      if (project != null && projectId == null) {
        projectId = await api.createProject(token, project)
        project.id = projectId
      }
      streamId = await api.createStream(token, stream, projectId)
      stream.id = streamId
    } else {
      // TODO check the stream exists
    }
    deployment.stream = stream
    deployment.stream.project = project
    return await dao.createDeployment(uid, deployment)
  } catch (error) {
    return await Promise.reject(error.message ?? error) // TODO use throw
  }
}

export const uploadFileAndSaveToDb = async (streamId: string, deploymentId: string, file?: any): Promise<string> => {
  if (file === null) {
    throw new Error('File should not be null')
  }
  try {
    const buf = file.buffer
    const fileName = file.originalname
    const fileExt = (fileName.match(/\.+[\S]+$/) ?? [])[0].slice(1)
    const fullFileName = generateFileName(streamId, deploymentId, fileExt)
    const remotePath = fileNameToPath(fullFileName)
    await uploadFile(remotePath, buf)
    const asset = await assetDao.create(fullFileName, streamId, deploymentId)
    return asset.id
  } catch (error) {
    return await Promise.reject(error.message ?? error) // TODO: use throw
  }
}

export default { createDeployment, uploadFileAndSaveToDb }
