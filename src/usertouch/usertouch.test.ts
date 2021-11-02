import routes from './router'
import { expressApp } from '../common/db/testing'
import request from 'supertest'
import { GET, setupMockAxios } from '../common/axios/mock'

const app = expressApp()

app.use('/', routes)

const endpoint = 'v1/users/touchapi'

describe('GET /usertouch', () => {
  test('get user touch api response', async () => {
    const mockResponse = { success: true }

    setupMockAxios(GET, endpoint, 200, mockResponse)
    const response = await request(app).get('/')

    expect(response.statusCode).toBe(200)
  })
})
