import { Deployment, Stream, Project } from 'src/types'

export const mapStreamsAndDeployments = async (streams: any[], deployments: any[]): Promise<Deployment[]> => {
  const newStreams = streams.map(st => {
    return st as Stream
  })
  const result = deployments.map(dp => {
    const deployment = dp.dataValues
    const stream = newStreams.filter(it => { return deployment.stream_id === it.id })[0]
    const project = stream.project as Project
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
    delete deployment.stream_id
    return deployment as Deployment
  })
  return result
}
