import deploymentDao from '../deployments/dao'
import { unZipDeploymentParameters } from './serializer'

export const getDeviceParametersByStreamId = async (streamId: string): Promise<String | any | null> => {
  const deployment = await deploymentDao.getByStreamId(streamId)
  return await unZipDeploymentParameters(deployment)
}

export default { getDeviceParametersByStreamId }
