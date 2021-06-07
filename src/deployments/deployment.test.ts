import routes from './router'
import { migrate, truncate, expressApp, seed, seedValues } from '../common/db/testing'
import request from 'supertest'
import { sequelize } from '../common/db'
import Deployment from 'src/deployments/deployment.model'
import dayJs from 'dayjs'
import sinon from 'sinon'
import service from './service'
import email from '../common/email'
import { GET, POST, PATCH, setupMockAxios } from '../common/axios/mock'
import Asset from 'src/assets/asset.model'

const app = expressApp()

app.use('/', routes)

beforeAll(async () => {
  await migrate(sequelize)
  await seed()
})
beforeEach(async () => {
  await truncate()
})

const streamEndpoint = 'streams'

describe('GET /deployments/:id', () => {
  test('get deployment success', async () => {
    const deploymentId = '0000000000000000'
    const mockDeployment = { id: deploymentId, streamId: 'aaaaaaaaaaaa', deploymentType: 'audiomoth', deployedAt: dayJs('2021-05-12T05:21:21.960Z').toDate(), isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(mockDeployment)
    const streamId = 'aaaaaaaaaaaa'
    const mockStream = { id: streamId, name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb', name: 'test-project', isPublic: true, externalId: null }, countryName: 'Thailand' }

    setupMockAxios(GET, `${streamEndpoint}/${streamId}`, 200, mockStream)
    const response = await request(app).get(`/${deploymentId}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('deploymentType')
    expect(response.body).toHaveProperty('deployedAt')
    expect(response.body).toHaveProperty('isActive')
    expect(response.body).toHaveProperty('stream')
  })

  test('get deployment no access', async () => {
    const deploymentId = '0000000000000000'
    const mockDeployment = { id: deploymentId, streamId: 'aaaaaaaaaaaa', deploymentType: 'audiomoth', deployedAt: dayJs('2021-05-12T05:21:21.960Z').toDate(), isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(mockDeployment)

    setupMockAxios(GET, `${streamEndpoint}/aaaaaaaaaaaa`, 403)
    const response = await request(app).get(`/${deploymentId}`)

    expect(response.statusCode).toBe(403)
  })

  test('get deployment stream not found', async () => {
    const deploymentId = '0000000000000000'
    const mockDeployment = { id: deploymentId, streamId: 'aaaaaaaaaaaa', deploymentType: 'audiomoth', deployedAt: dayJs('2021-05-12T05:21:21.960Z').toDate(), isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(mockDeployment)
    const streamId = 'aaaaaaaaaaaa'

    setupMockAxios(GET, `${streamEndpoint}/${streamId}`, 404)
    const response = await request(app).get(`/${deploymentId}`)

    expect(response.statusCode).toBe(404)
  })
})

describe('POST /deployments', () => {
  test('create deployment success include stream id and project id', async () => {
    const streamId = 'aaaaaaaaaaaa'
    const projectId = 'bbbbbbbbbbbb'
    const mockStream = { id: streamId, name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: projectId, name: 'test-project', isPublic: true, externalId: null }, countryName: 'Thailand' }
    const mockDeployment = { deployedAt: dayJs('2021-05-12T05:21:21.960Z'), deploymentKey: '0000000000000000', deploymentType: 'audiomoth', stream: { id: streamId, project: { id: projectId } } }

    setupMockAxios(GET, `${streamEndpoint}/${streamId}`, 200, mockStream)
    sinon.stub(email, 'sendNewDeploymentSuccessEmail')
    const response = await request(app).post('/').send(mockDeployment)

    expect(response.statusCode).toBe(201)
  })

  test('create deployment success include new stream and project id', async () => {
    const streamHeaders = { location: `/${streamEndpoint}/aaaaaaaaaaaa` }
    const mockDeployment = { deployedAt: dayJs('2021-05-12T05:21:21.960Z'), deploymentKey: '0000000000000000', deploymentType: 'audiomoth', stream: { name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb' } } }

    setupMockAxios(POST, streamEndpoint, 201, null, streamHeaders)
    const response = await request(app).post('/').send(mockDeployment)

    expect(response.statusCode).toBe(201)
  })

  test('create deployment failed with no deployment key', async () => {
    const mockDeployment = { deployedAt: dayJs('2021-05-12T05:21:21.960Z'), deploymentType: 'audiomoth', stream: { name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb' } } }

    const response = await request(app).post('/').send(mockDeployment)

    expect(response.statusCode).toBe(400)
  })

  test('create deployment failed with wrong date format', async () => {
    const mockDeployment = { deployedAt: '2021-05-12T05', deploymentType: 'audiomoth', stream: { name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb' } } }

    const response = await request(app).post('/').send(mockDeployment)

    expect(response.statusCode).toBe(400)
  })

  test('create deployment failed with duplicated deployment key', async () => {
    const deploymentId = '0000000000000000'
    const mockDeployment = { deployedAt: dayJs('2021-05-12T05:21:21.960Z'), deploymentKey: deploymentId, deploymentType: 'audiomoth', stream: { name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb' } } }
    const deployment = { id: deploymentId, streamId: 'aaaaaaaaaaaa', deploymentType: 'audiomoth', deployedAt: dayJs('2021-05-12T05:21:21.960Z').toDate(), isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(deployment)

    const response = await request(app).post('/').send(mockDeployment)

    expect(response.statusCode).toBe(400)
  })
})

describe('PATCH /deployments/:id', () => {
  test('patch deployment success', async () => {
    const deploymentId = '0000000000000000'
    const streamId = 'aaaaaaaaaaaa'
    const mockDeployment = { deployedAt: dayJs('2021-05-12T05:21:21.960Z'), deploymentKey: '0000000000000000', deploymentType: 'audiomoth', stream: { id: streamId, project: { id: 'bbbbbbbbbbbb' } } }

    setupMockAxios(PATCH, `${streamEndpoint}/${streamId}`, 201)
    const response = await request(app).patch(`/${deploymentId}`).send(mockDeployment)

    expect(response.statusCode).toBe(200)
  })

  test('patch deployment success with no stream', async () => {
    const deploymentId = '0000000000000000'
    const mockDeployment = { deployedAt: dayJs('2021-05-12T05:21:21.960Z'), deploymentKey: '0000000000000000', deploymentType: 'audiomoth' }

    const response = await request(app).patch(`/${deploymentId}`).send(mockDeployment)

    expect(response.statusCode).toBe(200)
  })
})

describe('DELETE /deployments/:id', () => {
  test('delete deployment success', async () => {
    const deploymentId = '0000000000000000'

    const response = await request(app).delete(`/${deploymentId}`)

    expect(response.statusCode).toBe(200)
  })
})

describe('GET /deployment/:id/assets', () => {
  test('get deployments assets', async () => {
    const deploymentId = '0000000000000000'
    const mockAsset = { fileName: 'test-file', mimeType: 'image/jpeg', streamId: 'aaaaaaaaaaaa', deploymentId: deploymentId }
    await Asset.create(mockAsset)

    const response = await request(app).get(`/${deploymentId}/assets`)
    expect(response.statusCode).toBe(200)
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).toHaveProperty('mimeType')
    expect(response.body[0]).toHaveProperty('createdAt')
    expect(response.body[0]).toHaveProperty('deletedAt')
  })
})

describe('POST /deployment/:id/assets', () => {
  test('upload deployments assets', async () => {
    const deploymentId = '0000000000000000'
    const mockFile = { file: 'test-file' }
    const deployment = { id: deploymentId, streamId: 'aaaaaaaaaaaa', deploymentType: 'audiomoth', deployedAt: dayJs('2021-05-12T05:21:21.960Z').toDate(), isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(deployment)
    const mockUploadReturn = 'test-asset-id'

    sinon.stub(service, 'uploadFileAndSaveToDb').returns(Promise.resolve(mockUploadReturn))
    const response = await request(app).post(`/${deploymentId}/assets`).send(mockFile)

    expect(response.statusCode).toBe(201)
    expect(response.headers.location).toEqual(`/assets/${mockUploadReturn}`)
  })
})
