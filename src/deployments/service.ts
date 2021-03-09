import dao from './dao'
import assetDao from '../assets/dao'
import configurationDao from '../configurations/dao'
import { uploadFile } from '../common/storage'
import { CreateDeploymentRequest, NewAsset, NewDeployment, CreateConfigurationRequest } from '../types'
import * as api from '../common/core-api'
import Deployment from './deployment.model'
import { assetPath, generateFilename } from '../common/storage/paths'
import { ValidationError } from 'sequelize'

export const createDeployment = async (uid: string, token: string, deployment: CreateDeploymentRequest): Promise<Deployment> => {
  try {
    const stream = deployment.stream
    // Check for new stream
    if (!('id' in stream)) {
      const project = stream.project
      // Check for new project
      if (project !== undefined && !('id' in project)) {
        const newProjectId = await api.createProject(token, project)
        stream.project = { id: newProjectId }
      }
      const newStreamId = await api.createStream(token, stream)
      deployment.stream = { id: newStreamId }
    } else {
      // Check the stream exists
      const streamOrUndefined = await api.getStream(token, stream.id)
      if (streamOrUndefined === undefined) {
        throw new ValidationError('stream not found')
      }
      if ('name' in stream || 'latitude' in stream || 'longitude' in stream || 'altitude' in stream) {
        await api.updateStream(token, stream)
      }
    }

    const type = deployment.deploymentType
    if (type === 'guardian') {
      const configuration = deployment.configuration as CreateConfigurationRequest
      if (configuration !== undefined) {
        const configurationId = await configurationDao.create(configuration)
        deployment.configuration = { id: configurationId }
      }
    }
    return await dao.createDeployment(uid, deployment as NewDeployment)
  } catch (error) {
    return await Promise.reject(error.message ?? error)
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
