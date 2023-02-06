import Deployment from 'src/deployments/deployment.model'
import { MappedDeploymentInfo } from '../types'
import * as gzip from '../common/gzip'

export const mapStreamsAndDeployments = (streams: any[], deployments: any[]): MappedDeploymentInfo[] => {
  const deploymentsData = deployments.map(dp => dp.dataValues)
  return streams.map(stream => {
    const deployment = deploymentsData.find(dp => stream.id === dp.streamId)
    const mappedDeploymentInfo: MappedDeploymentInfo = { ...stream }
    if (deployment != null) {
      mappedDeploymentInfo.deployment = { ...deployment, deviceParameters: JSON.parse(deployment.deviceParameters) }
    }
    return mappedDeploymentInfo
  })
}

export const unZipDeploymentParameters = async (deployment: Deployment | null): Promise<any> => {
  const params = deployment?.deviceParameters
  if (params == null) return params

  const json = JSON.parse(params.toString())
  if (!('ping' in json)) return params

  return await gzip.unZipJson(json.ping)
}
