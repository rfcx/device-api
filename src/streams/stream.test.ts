import routes from './router'
import { migrate, truncate, expressApp, seed, seedValues } from '../common/db/testing'
import request from 'supertest'
import { sequelize } from '../common/db'
import MockAdapter from 'axios-mock-adapter'
import axios from '../common/axios'
import Deployment from 'src/deployments/deployment.model'
import dayJs from 'dayjs'

const app = expressApp()

app.use('/', routes)

beforeAll(async () => {
  await migrate(sequelize)
  await seed()
})
beforeEach(async () => {
  await truncate()
})

describe('GET /streams', () => {
  test('get stream along with deployment', async () => {
    const mockDeployment = { id: '0000000000000000', streamId: 'aaaaaaaaaaaa', deploymentType: 'audiomoth', deployedAt: dayJs('2021-05-12T05:21:21.960Z').toDate(), isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(mockDeployment)
    const mockStream = { id: 'aaaaaaaaaaaa', name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb', name: 'test-project', isPublic: true, externalId: null }, countryName: 'Thailand' }

    const mockAdapter = new MockAdapter(axios)
    mockAdapter.onGet('/streams')
      .reply(200, [mockStream])
    const response = await request(app).get('/')

    expect(response.statusCode).toBe(200)
    expect(response.body[0]).toHaveProperty('deployment')
  })

  test('get stream without deployment', async () => {
    const mockStream = { id: 'aaaaaaaaaaaa', name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb', name: 'test-project', isPublic: true, externalId: null }, countryName: 'Thailand' }

    const mockAdapter = new MockAdapter(axios)
    mockAdapter.onGet('/streams')
      .reply(200, [mockStream])
    const response = await request(app).get('/')

    expect(response.statusCode).toBe(200)
    expect(response.body[0]).not.toHaveProperty('deployment')
  })
})
