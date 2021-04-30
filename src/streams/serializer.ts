import { MappedDeploymentInfo } from '../types'

export const mapStreamsAndDeployments = (streams: any[], deployments: any[]): MappedDeploymentInfo[] => {
  const deploymentsData = deployments.map( dp => dp.dataValues )
  return streams.map(stream => {
    const deployment = deploymentsData.find(dp => stream.id === dp.streamId)
    if (deployment != null) {
      return { ...stream, deployment: { ...deployment } } as MappedDeploymentInfo
    }
    return { ...stream} as MappedDeploymentInfo
  })
}
