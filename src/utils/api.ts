import config from '../config'
import { Project, Stream } from '../types'
import axios from 'axios'

// set up global axios instance

const instance = axios.create({
  baseURL: config.INGEST_URL,
  timeout: 4000,
  headers: { 'Content-Type': 'application/json' }
})
instance.interceptors.request.use(function (conf) {
  return conf
}, function (error) {
  return Promise.reject(error)
})

instance.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})

export const createStreamToCore = async (token: string | null, stream: Stream, projectId: string | null) => {
  if (!token) { return Promise.reject(new Error('Unauthorized')) }
  const params = {
    name: stream.name,
    latitude: stream.latitude,
    longitude: stream.longitude,
    altitude: stream.altitude,
    project_id: projectId || null
  }
  return instance.post('/streams',
    params,
    { headers: { 'Authorization': token } })
    .then(response => {
      return response.data.id
    }).catch(error => {
      console.log(error)
      return Promise.reject(error)
    })
}

export const createProjectToCore = async (token: string | null, project: Project) => {
  if (!token) { return Promise.reject(new Error('Unauthorized')) }
  const params = {
    name: project.name
  }
  return instance.post('/projects',
    params,
    { headers: { 'Authorization': token } })
    .then(response => {
      return response.data.id
    }).catch(error => {
      console.log(error)
      return Promise.reject(error)
    })
}

export const updateStreamToCore = async (token: string | null, stream: Stream) => {
  if (!token) { return Promise.reject(new Error('Unauthorized')) }
  const params = {
    name: stream.name,
    latitude: stream.latitude,
    longitude: stream.longitude,
    altitude: stream.altitude
  }
  return instance.patch(`/streams/${stream.id}`,
    params,
    { headers: { 'Authorization': token } })
    .then(response => {
      return response.data
    }).catch(error => {
      console.log(error)
      return Promise.reject(error)
    })
}

export const updateProjectToCore = async (token: string | null, project: Project) => {
  if (!token) { return Promise.reject(new Error('Unauthorized')) }
  const params = {
    name: project.name
  }
  return instance.patch(`/projects/${project.id}`,
    params,
    { headers: { 'Authorization': token } })
    .then(response => {
      return response.data
    }).catch(error => {
      console.log(error)
      return Promise.reject(error)
    })
}
