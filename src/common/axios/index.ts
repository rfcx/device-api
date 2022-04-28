import axios from 'axios'
import config from '../../config'

export const coreInstance = axios.create({
  baseURL: config.CORE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})
// TODO I think `await Promise.reject(error) === error` so these are not needed
coreInstance.interceptors.request.use(function (conf) {
  return conf
}, async function (error) {
  return await Promise.reject(error)
})
coreInstance.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  return await Promise.reject(error)
})

export const noncoreInstance = axios.create({
  baseURL: config.NONCORE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})
// TODO I think `await Promise.reject(error) === error` so these are not needed
coreInstance.interceptors.request.use(function (conf) {
  return conf
}, async function (error) {
  return await Promise.reject(error)
})
coreInstance.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  return await Promise.reject(error)
})

export default coreInstance
