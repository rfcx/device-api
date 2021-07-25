import axios from '../axios'
import { ProjectResponse, StreamResponse, CreateStreamRequest, CreateProjectRequest, UpdateProjectRequest, UpdateStreamRequest } from '../../types'
import { snakeToCamel } from '../serializers/snake-camel'

export const createStream = async (token: string, stream: CreateStreamRequest): Promise<string> => {
  const data = {
    name: stream.name,
    latitude: stream.latitude,
    longitude: stream.longitude,
    altitude: stream.altitude,
    project_id: stream.project !== undefined && 'id' in stream.project ? stream.project.id : undefined
  }
  const response = await axios.post('/streams', data, { headers: { Authorization: token } })
  const headers: { location?: string } = response.headers
  if (response.status === 201 && headers.location !== undefined) {
    const regexResult = /\/streams\/(?<id>\w+)$/.exec(headers.location)
    if (regexResult?.groups != null) {
      return regexResult.groups.id
    }
    throw new Error(`Unable to parse location header: ${headers.location}`)
  }
  throw new Error(`Unexpected status code or location header: ${response.status} ${headers.location ?? 'undefined'}`)
}

export const createProject = async (token: string, project: CreateProjectRequest): Promise<string> => {
  const options = { headers: { Authorization: token } }
  const response = await axios.post('/projects', project, options)
  const headers: { location?: string } = response.headers
  if (response.status === 201 && headers.location !== undefined) {
    const regexResult = /\/projects\/(?<id>\w+)$/.exec(headers.location)
    if (regexResult?.groups != null) {
      return regexResult.groups.id
    }
    throw new Error(`Unable to parse location header: ${headers.location}`)
  }
  throw new Error(`Unexpected status code or location header: ${response.status} ${headers.location ?? 'undefined'}`)
}

export const updateStream = async (token: string, stream: UpdateStreamRequest): Promise<StreamResponse> => {
  const { id, ...data } = stream
  const options = { headers: { Authorization: token } }
  const response = await axios.patch(`/streams/${id}`, data, options)
  return response.data
}

export const updateProject = async (token: string, project: UpdateProjectRequest): Promise<ProjectResponse> => {
  const { id, ...data } = project
  const options = { headers: { Authorization: token } }
  const response = await axios.patch(`/projects/${id}`, data, options)
  return response.data
}

export const getStreams = async (token: string, params: any = {}): Promise<StreamResponse[]> => {
  const options = {
    headers: { Authorization: token },
    params: { ...params, fields: ['id', 'name', 'latitude', 'longitude', 'altitude', 'project', 'created_at'] }
  }
  const response = await axios.get('/streams', options)
  return snakeToCamel(response.data)
}

export const getStream = async (token: string, id: string): Promise<StreamResponse> => {
  const options = {
    headers: { Authorization: token },
    params: { fields: ['id', 'name', 'latitude', 'longitude', 'altitude', 'project'] }
  }
  const response = await axios.get<StreamResponse>(`/streams/${id}`, options)
  return snakeToCamel(response.data)
}

export const getProjects = async (token: string, params: unknown = {}): Promise<ProjectResponse[]> => {
  const options = {
    headers: { Authorization: token },
    params
  }
  const response = await axios.get('/projects', options)
  return snakeToCamel(response.data)
}
