import routes from './router'
import { expressApp } from '../common/db/testing'
import request from 'supertest'
import { POST, setupMockAxios } from '../common/axios/mock'

const app = expressApp()

app.use('/', routes)

const endpoint = 'v2/guardians/register'

describe('POST /guardians', () => {
  test('register guardian with guid ', async () => {
    const mockResponse = {
      name: 'RFCx Guardian (TESTGU)',
      guid: 'testguardian',
      token: 'qojpdg30xdai32lj74ayd6b2x2shbg6qqdqizwyh',
      pinCode: 'znti',
      apiMqttHost: 'staging-api-mqtt.rfcx.org',
      apiSmsAddress: '+14154803657',
      keystorePassphrase: 'L2Cevkmc9W5fFCKn'
  }

    setupMockAxios(POST, endpoint, 200, mockResponse)
    const response = await request(app).post('/').send({ guid: 'testguardian' })

    expect(response.statusCode).toBe(200)
  })
})

