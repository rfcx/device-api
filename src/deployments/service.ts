import dao from './dao'
import assetDao from '../assets/dao'
import { uploadFile } from '../common/storage'
import { CreateDeploymentRequest, NewAsset, NewDeployment, UpdateGuardian, User } from '../types'
import * as api from '../common/core-api'
import Deployment from './deployment.model'
import { assetPath, generateFilename } from '../common/storage/paths'
import email from '../common/email'
import { ValidationError } from 'sequelize'

export const createDeployment = async (appVersion: number | undefined, uid: string, token: string, user: User, deployment: CreateDeploymentRequest): Promise<Deployment> => {
  // Check if id existed
  if (await dao.get(deployment.deploymentKey) != null) {
    console.error('this deploymentKey is already existed')
    throw new ValidationError('this deploymentKey is already existed')
  }

  const stream = deployment.stream
  let guardianUpdate: UpdateGuardian = {}
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
    guardianUpdate = { stream_id: newStreamId, ...stream }
  } else {
    // Check the stream exists
    const streamOrUndefined = await api.getStream(token, stream.id)
    if (streamOrUndefined === undefined) {
      throw new ValidationError('stream not found')
    }
    if ('name' in stream || 'latitude' in stream || 'longitude' in stream || 'altitude' in stream) {
      await api.updateStream(token, stream)
    }
    guardianUpdate = { stream_id: stream.id, ...stream }
  }

  const deviceParameters = deployment.deviceParameters
  if (deployment.deploymentType === 'guardian') {
    if (deviceParameters != null) {
      if (!('guid' in deviceParameters) || deviceParameters.guid == null) {
        throw new ValidationError('deviceParameters: guid cannot be null or undefined')
      }
      if (deviceParameters.guid.length > 12) {
        throw new ValidationError('deviceParameters: guid length cannot more than 12')
      }
      if (appVersion !== undefined && appVersion > 61) {
        await api.updateGuardian(token, deviceParameters.guid, guardianUpdate)
      }
    }
  }

  const result = await dao.createDeployment(uid, deployment as NewDeployment)
  await email.sendNewDeploymentSuccessEmail(deployment as NewDeployment, user)
  return result
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
    throw new Error(error.message ?? error)
  }
}

export default { createDeployment, uploadFileAndSaveToDb }
