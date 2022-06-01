import dao from './dao'
import assetDao from '../assets/dao'
import { uploadFile } from '../common/storage'
import { DeploymentRequest, NewAsset, UpdateGuardian, User } from '../types'
import * as api from '../common/core-api'
import Deployment from './deployment.model'
import { assetPath, generateFilename } from '../common/storage/paths'
import email from '../common/email'
import { ValidationError } from 'sequelize'
import GuardianLog from 'src/guardian-log/guardian-log.model'

export const createDeployment = async (appVersion: number | undefined, uid: string, token: string, user: User, deployment: DeploymentRequest): Promise<Deployment> => {
  // Check if id existed
  if (await dao.get(deployment.deploymentKey) != null) {
    console.error('this deploymentKey is already existed')
    throw new ValidationError('this deploymentKey is already existed')
  }

  const stream = deployment.stream
  let guardianUpdate: UpdateGuardian = {}
  // Check for new stream
  if (stream.id === undefined) {
    const project = stream.project
    // Check for new project
    if (project !== undefined && project.id === undefined) {
      const newProjectId = await api.createProject(token, project)
      stream.project = { id: newProjectId }
    }
    const newStreamId = await api.createStream(token, stream)
    deployment.stream = { id: newStreamId }
    guardianUpdate = { stream_id: newStreamId, project_id: stream.project?.id, ...stream }
  } else {
    // Check the stream exists
    const streamOrUndefined = await api.getStream(token, stream.id)
    if (streamOrUndefined === undefined) {
      throw new ValidationError('stream not found')
    }
    if (stream.name != null || stream.latitude != null || stream.longitude != null || stream.altitude != null) {
      await api.updateStream(token, stream)
    }
    guardianUpdate = { stream_id: stream.id, project_id: stream.project?.id, ...stream }
  }

  if (deployment.deploymentType === 'guardian') {
    const deviceParameters = deployment.deviceParameters
    if (deviceParameters != null) {
      try {
        await createGuardianLog(deviceParameters, guardianUpdate)
      } catch (error) {
        console.warn(error)
      }
    }
  }

  const result = await dao.createDeployment(uid, deployment)
  await email.sendNewDeploymentSuccessEmail(deployment, user)
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

const createGuardianLog = async (deviceParameters: any, guardianUpdate: UpdateGuardian): Promise<void> => {
  if (deviceParameters.guid != null) {
    await dao.createGuardianLog(deviceParameters.guid, 'update', JSON.stringify(guardianUpdate))
    if (hasRegistrationProperties(deviceParameters) === true) {
      await dao.createGuardianLog(deviceParameters.guid, 'register', JSON.stringify(deviceParameters))
    }
  }
}

const hasRegistrationProperties = (deviceParameters: any): Boolean => {
  if (!('token' in deviceParameters) || deviceParameters.token == null) return false
  if (!('pin_code' in deviceParameters) || deviceParameters.pin_code == null) return false
  return true
}

export default { createDeployment, uploadFileAndSaveToDb }
