import { DeploymentResponse, StreamResponse, ProjectResponse } from 'src/types'

export const mapStreamsAndDeployments = async (streams: any[], deployments: any[]): Promise<DeploymentResponse[]> => {
  const newStreams = streams.map(st => {
    return st as StreamResponse
  })
  const results = deployments.map(dp => {
    const deployment = dp.dataValues
    const stream = newStreams.find(it => deployment.streamId === it.id)
    if (stream === undefined) {
      return undefined
    }
    const project = stream.project as ProjectResponse
    let projectObj: {} | null = null
    if (project != null) {
      projectObj = {
        id: project.id,
        name: project.name
      }
    }
    deployment.stream = {
      id: stream.id,
      name: stream.name,
      latitude: stream.latitude,
      longitude: stream.longitude,
      altitude: stream.altitude,
      project: projectObj
    }
    delete deployment.streamId
    return deployment as DeploymentResponse
  })
  return results.filter((x): x is DeploymentResponse => x !== undefined)
}
