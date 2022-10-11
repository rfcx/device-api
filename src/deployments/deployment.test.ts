import routes from './router'
import { migrate, truncate, expressApp, seed, seedValues } from '../common/db/testing'
import request from 'supertest'
import db from '../common/db'
import Deployment from 'src/deployments/deployment.model'
import dayJs from 'dayjs'
import service from './service'
import email from '../common/email'
import { GET, POST, PATCH, setupMockAxios } from '../common/axios/mock'
import Asset from 'src/assets/asset.model'
import GuardianLog from 'src/guardian-log/guardian-log.model'

const app = expressApp()

app.use('/', routes)

beforeAll(async () => {
  await migrate(db.sequelize)
  await seed()
})
beforeEach(async () => {
  await truncate()
})
afterEach(async () => {
  await jest.clearAllMocks()
  await jest.restoreAllMocks()
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

    const spy = jest.spyOn(email, 'sendNewDeploymentSuccessEmail').mockReturnValue(Promise.resolve('Message sent'))
    setupMockAxios(GET, `${streamEndpoint}/${streamId}`, 200, mockStream)
    const response = await request(app).post('/').send(mockDeployment)

    expect(spy).toHaveBeenCalled()
    expect(response.statusCode).toBe(201)
  })

  test('create deployment success include new stream and project id', async () => {
    const streamHeaders = { location: `/${streamEndpoint}/aaaaaaaaaaaa` }
    const mockDeployment = { deployedAt: dayJs('2021-05-12T05:21:21.960Z'), deploymentKey: '0000000000000000', deploymentType: 'audiomoth', stream: { name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb' } } }

    const spy = jest.spyOn(email, 'sendNewDeploymentSuccessEmail').mockReturnValue(Promise.resolve('Message sent'))
    setupMockAxios(POST, streamEndpoint, 201, null, streamHeaders)
    const response = await request(app).post('/').send(mockDeployment)

    expect(spy).toHaveBeenCalled()
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

  test('create guardian deployment success without guid in deviceParameters', async () => {
    const streamHeaders = { location: `/${streamEndpoint}/aaaaaaaaaaaa` }
    const mockDeployment = { deployedAt: dayJs('2021-05-12T05:21:21.960Z'), deploymentKey: '0000000000000000', deploymentType: 'guardian', stream: { name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb' } }, deviceParameters: { something: 'gggggggggggg' } }

    const spy = jest.spyOn(email, 'sendNewDeploymentSuccessEmail').mockReturnValue(Promise.resolve('Message sent'))
    setupMockAxios(POST, streamEndpoint, 201, null, streamHeaders)
    const response = await request(app).post('/').send(mockDeployment)
    const guardianLog = await GuardianLog.findAll()

    expect(spy).toHaveBeenCalled()
    expect(response.statusCode).toBe(201)
    expect(guardianLog.length).toBe(0)
  })

  test('create guardian deployment success with guid is null in deviceParameters', async () => {
    const streamHeaders = { location: `/${streamEndpoint}/aaaaaaaaaaaa` }
    const mockDeployment = { deployedAt: dayJs('2021-05-12T05:21:21.960Z'), deploymentKey: '0000000000000000', deploymentType: 'guardian', stream: { name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb' } }, deviceParameters: { guid: null } }

    const spy = jest.spyOn(email, 'sendNewDeploymentSuccessEmail').mockReturnValue(Promise.resolve('Message sent'))
    setupMockAxios(POST, streamEndpoint, 201, null, streamHeaders)
    const response = await request(app).post('/').send(mockDeployment)
    const guardianLog = await GuardianLog.findAll()

    expect(spy).toHaveBeenCalled()
    expect(response.statusCode).toBe(201)
    expect(guardianLog.length).toBe(0)
  })

  test('create guardian deployment success with guid in deviceParameters save in GuardianLog', async () => {
    const streamHeaders = { location: `/${streamEndpoint}/aaaaaaaaaaaa` }
    const mockDeployment = { deployedAt: dayJs('2021-05-12T05:21:21.960Z'), deploymentKey: '0000000000000000', deploymentType: 'guardian', stream: { name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb' } }, deviceParameters: { guid: 'gggggggggggg123' } }
    const expectedGuardianLogBody = { stream_id: 'aaaaaaaaaaaa', shortname: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project_id: 'bbbbbbbbbbbb', is_deployed: true }

    const spy = jest.spyOn(email, 'sendNewDeploymentSuccessEmail').mockReturnValue(Promise.resolve('Message sent'))
    setupMockAxios(POST, streamEndpoint, 201, null, streamHeaders)
    const response = await request(app).post('/').send(mockDeployment)
    const guardianLog = await GuardianLog.findOne({ where: { guardian_id: 'gggggggggggg123' } })

    expect(spy).toHaveBeenCalled()
    expect(response.statusCode).toBe(201)
    expect(guardianLog?.guardianId).toBe('gggggggggggg123')
    expect(guardianLog?.type).toBe('update')
    expect(guardianLog?.body).toBe(JSON.stringify(expectedGuardianLogBody))
  })

  test('create guardian deployment success with guid and token for registration in deviceParameters', async () => {
    const streamHeaders = { location: `/${streamEndpoint}/aaaaaaaaaaaa` }
    const mockDeviceParameters = { guid: 'gggggggggggg', token: 'token', pin_code: 'pinCode' }
    const mockDeployment = { deployedAt: dayJs('2021-05-12T05:21:21.960Z'), deploymentKey: '0000000000000000', deploymentType: 'guardian', stream: { name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb' } }, deviceParameters: mockDeviceParameters }
    const expectedGuardianLogBody = { stream_id: 'aaaaaaaaaaaa', shortname: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project_id: 'bbbbbbbbbbbb', is_deployed: true }

    const spy = jest.spyOn(email, 'sendNewDeploymentSuccessEmail').mockReturnValue(Promise.resolve('Message sent'))
    setupMockAxios(POST, streamEndpoint, 201, null, streamHeaders)
    const response = await request(app).post('/').send(mockDeployment)
    const guardianLog = await GuardianLog.findAll({ where: { guardian_id: 'gggggggggggg' } })

    expect(spy).toHaveBeenCalled()
    expect(response.statusCode).toBe(201)
    expect(guardianLog?.length).toBe(2)
    expect(guardianLog[0]?.guardianId).toBe('gggggggggggg')
    expect(guardianLog[0]?.type).toBe('register')
    expect(guardianLog[0]?.body).toBe(JSON.stringify(mockDeviceParameters))
    expect(guardianLog[1]?.guardianId).toBe('gggggggggggg')
    expect(guardianLog[1]?.type).toBe('update')
    expect(guardianLog[1]?.body).toBe(JSON.stringify(expectedGuardianLogBody))
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

    const spy = jest.spyOn(service, 'uploadFileAndSaveToDb').mockReturnValue(Promise.resolve(mockUploadReturn))
    const response = await request(app).post(`/${deploymentId}/assets`).send(mockFile)

    expect(spy).toHaveBeenCalled()
    expect(response.statusCode).toBe(201)
    expect(response.headers.location).toEqual(`/assets/${mockUploadReturn}`)
  })
})
