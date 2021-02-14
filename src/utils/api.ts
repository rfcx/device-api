import config from '../config'
import { Project, Stream } from '../types'
import axios, { AxiosResponse } from 'axios'

// set up global axios instance

const instance = axios.create({
  baseURL: config.INGEST_URL,
  timeout: 4000,
  headers: { 'Content-Type': 'application/json' }
})
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

export const createStreamToCore = async (token: string | null, stream: Stream, projectId: string | null): Promise<string> => {
  if (token == null) { return await Promise.reject(new Error('Unauthorized')) }
  const params = {
    name: stream.name,
    latitude: stream.latitude,
    longitude: stream.longitude,
    altitude: stream.altitude,
    project_id: projectId ?? null
  }
  return await instance.post('/streams',
    params,
    { headers: { Authorization: token } })
    .then(response => {
      return response.data.id
    }).catch(async error => {
      console.log(error)
      return await Promise.reject(error)
    })
}

export const createProjectToCore = async (token: string | null, project: Project): Promise<string> => {
  if (token == null) { return await Promise.reject(new Error('Unauthorized')) }
  const params = {
    name: project.name
  }
  return await instance.post('/projects',
    params,
    { headers: { Authorization: token } })
    .then(response => {
      return response.data.id
    }).catch(async error => {
      console.log(error)
      return await Promise.reject(error)
    })
}

export const updateStreamToCore = async (token: string | null, stream: Stream): Promise<AxiosResponse<any>> => {
  if (token == null) { return await Promise.reject(new Error('Unauthorized')) }
  const params = {
    name: stream.name,
    latitude: stream.latitude,
    longitude: stream.longitude,
    altitude: stream.altitude
  }
  return await instance.patch(`/streams/${stream.id ?? ''}`,
    params,
    { headers: { Authorization: token } })
    .then(response => {
      return response.data
    }).catch(async error => {
      console.log(error)
      return await Promise.reject(error)
    })
}

export const updateProjectToCore = async (token: string | null, project: Project): Promise<AxiosResponse<any>> => {
  if (token == null) { return await Promise.reject(new Error('Unauthorized')) }
  const params = {
    name: project.name
  }
  return await instance.patch(`/projects/${project.id ?? ''}`,
    params,
    { headers: { Authorization: token } })
    .then(response => {
      return response.data
    }).catch(async error => {
      return await Promise.reject(error)
    })
}

export const getStreamsFromCore = async (token: string): Promise<AxiosResponse<any[]>> => {
  if (token == null) { return await Promise.reject(new Error('Unauthorized')) }
  const params = {
    created_by: 'me'
  }
  return await instance.get(`/streams`,
    { headers: { Authorization: token },
      params: params })
    .then(response => {
      return response
    }).catch(async error => {
      return await Promise.reject(error)
    })
}
