import dao from './dao'
import assetDao from '../assets/dao'
import { uploadFile } from '../common/storage'
import { DeploymentResponse, NewAsset, ProjectResponse } from '../types'
import * as api from '../common/core-api'
import Deployment from './deployment.model'
import { assetPath, generateFilename } from '../common/storage/paths'

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
    const fileName = generateFilename(file.originalname)
    const mimeType = file.mimetype
    const newAsset: NewAsset = {
      fileName, mimeType, streamId, deploymentId
    }
    const asset = await assetDao.create(newAsset)
    const remotePath = assetPath(asset)
    await uploadFile(remotePath, buf)
    return asset.id
  } catch (error) {
    return await Promise.reject(error.message ?? error) // TODO: use throw
  }
}

export default { createDeployment, uploadFileAndSaveToDb }
