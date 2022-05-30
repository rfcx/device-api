import MockAdapter from 'axios-mock-adapter'
import axios from './index'

export const GET = 'GET'
export const POST = 'POST'
export const PATCH = 'PATCH'

export const CORE = 'core'
export const NONCORE = 'noncore'

export function setupMockAxios (request: string, endpoint: string, status: number, mockResponse?: any, headers?: any, env: string = CORE): MockAdapter | undefined {
  let mockAdapter = new MockAdapter(axios.coreInstance)
  if (env === NONCORE) {
    mockAdapter = new MockAdapter(axios.noncoreInstance)
  }
  if (request === GET) {
    const mock = mockAdapter.onGet(`/${endpoint}`)
    return mock.reply(status, mockResponse, headers)
  }
  if (request === POST) {
    const mock = mockAdapter.onPost(`/${endpoint}`)
    return mock.reply(status, mockResponse, headers)
  }
  if (request === PATCH) {
    const mock = mockAdapter.onPatch(`/${endpoint}`)
    return mock.reply(status, mockResponse, headers)
  }
}

export default { GET, POST, PATCH, setupMockAxios }
