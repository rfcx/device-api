import routes from './router'
import { expressApp } from '../common/db/testing'
import request from 'supertest'
import { NONCORE, POST, setupMockAxios } from '../common/axios/mock'

const app = expressApp()

app.use('/', routes)

const endpoint = 'v2/guardians/register'

describe('POST /guardians', () => {
  test('register guardian with guid', async () => {
    const mockResponse = {
      name: 'RFCx Guardian (TESTGU)',
      guid: 'testguardian',
      token: 'test-token'
    }

    setupMockAxios(POST, endpoint, 200, mockResponse, null, NONCORE)
    const response = await request(app).post('/').send({ guid: 'testguardian' })

    expect(response.statusCode).toBe(200)
  })
})
