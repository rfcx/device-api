import { DeploymentResponse, StreamResponse, ProjectResponse } from 'src/types'

export const mapStreamsAndDeployments = async (streams: any[], deployments: any[]): Promise<DeploymentResponse[]> => {
  const newStreams = streams.map(st => {
    return st as StreamResponse
  })
  const result = deployments.map(dp => {
    const deployment = dp.dataValues
    const stream = newStreams.filter(it => { return deployment.streamId === it.id })[0]
    const project = stream.project as ProjectResponse
    deployment.stream = {
      id: stream.id,
      name: stream.name,
      latitude: stream.latitude,
      longitude: stream.longitude,
      altitude: stream.altitude,
      project: {
        id: project.id,
        name: project.name
      }
    }
    delete deployment.streamId
    return deployment as DeploymentResponse
  })
  return result
}
