import routes from './router'
import { migrate, truncate, expressApp, seed, seedValues } from '../common/db/testing'
import request from 'supertest'
import db from '../common/db'
import Deployment from 'src/deployments/deployment.model'
import dayJs from 'dayjs'
import { GET, setupMockAxios } from '../common/axios/mock'
import Asset from 'src/assets/asset.model'

const app = expressApp()

app.use('/', routes)

beforeAll(async () => {
  await migrate(db.sequelize)
  await seed()
})
beforeEach(async () => {
  await truncate()
})

const endpoint = 'streams'

describe('GET /streams', () => {
  test('get stream along with deployment', async () => {
    const mockDeployment = { id: '0000000000000000', streamId: 'aaaaaaaaaaaa', deploymentType: 'audiomoth', deployedAt: dayJs('2021-05-12T05:21:21.960Z').toDate(), isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(mockDeployment)
    const mockStream = { id: 'aaaaaaaaaaaa', name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb', name: 'test-project', isPublic: true, externalId: null }, countryName: 'Thailand' }

    setupMockAxios(GET, endpoint, 200, [mockStream])
    const response = await request(app).get('/')

    expect(response.statusCode).toBe(200)
    expect(response.body[0]).toHaveProperty('deployment')
  })

  test('get stream without deployment', async () => {
    const mockStream = { id: 'aaaaaaaaaaaa', name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb', name: 'test-project', isPublic: true, externalId: null }, countryName: 'Thailand' }

    setupMockAxios(GET, endpoint, 200, [mockStream])
    const response = await request(app).get('/')

    expect(response.statusCode).toBe(200)
    expect(response.body[0]).not.toHaveProperty('deployment')
  })

  test('get stream return empty list even has a deployment', async () => {
    const mockDeployment = { id: '0000000000000000', streamId: 'aaaaaaaaaaaa', deploymentType: 'audiomoth', deployedAt: dayJs('2021-05-12T05:21:21.960Z').toDate(), isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(mockDeployment)

    setupMockAxios(GET, endpoint, 200, [])
    const response = await request(app).get('/')

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([])
  })
})

describe('GET /streams/:id/assets', () => {
  test('get stream assets', async () => {
    const streamId = 'aaaaaaaaaaaa'
    const mockAsset = { fileName: 'test-file', mimeType: 'image/jpeg', streamId: streamId, deploymentId: '0000000000000000' }
    await Asset.create(mockAsset)

    const response = await request(app).get(`/${streamId}/assets`)
    expect(response.statusCode).toBe(200)
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).toHaveProperty('mimeType')
    expect(response.body[0]).toHaveProperty('createdAt')
    expect(response.body[0]).toHaveProperty('deletedAt')
  })

  test('get stream with empty asset', async () => {
    const streamId = 'aaaaaaaaaaaa'

    const response = await request(app).get(`/${streamId}/assets`)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([])
  })
})
