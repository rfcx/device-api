import axios from 'axios'
import config from '../../config'
import { ProjectResponse, StreamResponse, CreateStreamRequest, CreateProjectRequest, UpdateProjectRequest, UpdateStreamRequest } from '../../types'
import { snakeToCamel } from '../serializers/snake-camel'

const instance = axios.create({
  baseURL: config.CORE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})
// TODO I think `await Promise.reject(error) === error` so these are not needed
instance.interceptors.request.use(function (conf) {
  return conf
}, async function (error) {
  return await Promise.reject(error)
})
instance.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  return await Promise.reject(error)
})

export const createStream = async (token: string, stream: CreateStreamRequest): Promise<string> => {
  const data = {
    name: stream.name,
    latitude: stream.latitude,
    longitude: stream.longitude,
    altitude: stream.altitude,
    project_id: stream.project !== undefined && 'id' in stream.project ? stream.project.id : undefined
  }
  const response = await instance.post('/streams', data, { headers: { Authorization: token } })
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
  const response = await instance.post('/projects', project, options)
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
  const response = await instance.patch(`/streams/${id}`, data, options)
  return response.data
}

export const updateProject = async (token: string, project: UpdateProjectRequest): Promise<ProjectResponse> => {
  const { id, ...data } = project
  const options = { headers: { Authorization: token } }
  const response = await instance.patch(`/projects/${id}`, data, options)
  return response.data
}

export const getStreams = async (token: string, params: unknown = {}): Promise<StreamResponse[]> => {
  const options = {
    headers: { Authorization: token },
    params
  }
  const response = await instance.get('/streams', options)
  return snakeToCamel(response.data)
}

export const getStream = async (token: string, id: string): Promise<StreamResponse | undefined> => {
  const options = {
    headers: { Authorization: token },
    params: { fields: ['id', 'name', 'latitude', 'longitude', 'altitude', 'project'] }
  }
  try {
    const response = await instance.get<StreamResponse>(`/streams/${id}`, options)
    return snakeToCamel(response.data)
  } catch (error) {
    if (error.response !== undefined && error.response.status >= 400 && error.response.status <= 499) {
      return undefined
    }
    throw error
  }
}

export const getProjects = async (token: string, params: unknown = {}): Promise<ProjectResponse[]> => {
  const options = {
    headers: { Authorization: token },
    params
  }
  const response = await instance.get('/projects', options)
  return snakeToCamel(response.data)
}
