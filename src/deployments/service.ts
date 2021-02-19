import dao from './dao'
import { uploadFile } from '../common/amazon'
import { generateFileName, fileNameToPath } from '../common/misc/file'
import { DeploymentResponse, ProjectResponse } from 'src/types'

export const createDeployment = async (uid: string, deployment: DeploymentResponse) => {
  const stream = deployment.stream
  const project = stream.project as ProjectResponse ?? null

  let projectId = project?.id ?? null
  let streamId = stream?.id ?? null
}

export const uploadFileAndSaveToDb = async (streamId: string, deploymentId: string, file?: any): Promise<string> => {
  try {
    if (file != null) {
      const buf = file.buffer
      const fileName = file.originalname
      const fileExt = (fileName.match(/\.+[\S]+$/) ?? [])[0].slice(1)
      const fullFileName = generateFileName(streamId, deploymentId, fileExt)
      const remotePath = fileNameToPath(fullFileName)
      await uploadFile(remotePath, buf)
      return await dao.createAsset(fullFileName, streamId)
    }
    return await Promise.reject(new Error('File should not be null'))
  } catch (error) {
    return await Promise.reject(error.message ?? error)
  }
}
