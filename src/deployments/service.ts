import dao from './dao'
import { uploadFile } from '../common/amazon'
import { getFileTypeFromBase64 } from '../common/mime'
import { generateFileName, fileNameToPath } from '../common/misc/file'
import { DeploymentResponse, ProjectResponse } from 'src/types'

export const createDeployment = async (uid: string, deployment: DeploymentResponse) => {
  const stream = deployment.stream
  const project = stream.project as ProjectResponse ?? null

  let projectId = project?.id ?? null
  let streamId = stream?.id ?? null
}

export const uploadFileAndSaveToDb = async (streamId: string, deploymentId: string, imageBase64?: string, imageFile?: any): Promise<string> => {
  if (imageBase64 != null) {
    const stripedImageBin = imageBase64.replace(/^data:image\/\w+;base64,/, '')
    const type = await getFileTypeFromBase64(stripedImageBin)
    if (type?.ext != null && ['jpg', 'png'].includes(type?.ext)) {
      const buf = Buffer.from(stripedImageBin, 'base64')
      const opt = { ContentEncoding: 'base64' }

      const fullFileName = generateFileName(streamId, deploymentId, type.ext)
      const remotePath = fileNameToPath(fullFileName)
      await uploadFile(remotePath, buf, opt)
      return await dao.createAssets(fullFileName, streamId)
    }
    return await Promise.reject(new Error('File type is not compatible'))
  } else {
    const buf = imageFile.buffer
    const fileName = imageFile.originalname
    const fileExt = (fileName.match(/\.+[\S]+$/) ?? [])[0].slice(1)
    const fullFileName = generateFileName(streamId, deploymentId, fileExt)
    const remotePath = fileNameToPath(fullFileName)
    await uploadFile(remotePath, buf)
    return await dao.createAssets(fullFileName, streamId)
  }
}
