import { MappedDeploymentInfo } from '../types'

export const mapStreamsAndDeployments = (streams: any[], deployments: any[]): MappedDeploymentInfo[] => {
  const deploymentsData = deployments.map(dp => dp.dataValues)
  return streams.map(stream => {
    const deployment = deploymentsData.find(dp => stream.id === dp.streamId)
    const mappedDeploymentInfo: MappedDeploymentInfo = { ...stream }
    if (deployment != null) {
      mappedDeploymentInfo.deployment = { ...deployment, deploymentParameters: JSON.parse(deployment.deploymentParameters) }
    }
    return mappedDeploymentInfo
  })
}
