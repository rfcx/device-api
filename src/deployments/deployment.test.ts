import routes from './router'
import { migrate, truncate, expressApp, seed, seedValues } from '../common/db/testing'
import request from 'supertest'
import db from '../common/db'
import Deployment from 'src/deployments/deployment.model'
import service from './service'
import * as api from '../common/core-api'
import email from '../common/email'
import { GET, POST, PATCH, setupMockAxios } from '../common/axios/mock'
import Asset from 'src/assets/asset.model'
import GuardianLog from 'src/guardian-log/guardian-log.model'
import { StreamResponse } from 'src/types'

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
    const mockDeployment = { id: deploymentId, streamId: 'aaaaaaaaaaaa', deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
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
    const mockDeployment = { id: deploymentId, streamId: 'aaaaaaaaaaaa', deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(mockDeployment)

    setupMockAxios(GET, `${streamEndpoint}/aaaaaaaaaaaa`, 403)
    const response = await request(app).get(`/${deploymentId}`)

    expect(response.statusCode).toBe(403)
  })

  test('get deployment stream not found', async () => {
    const deploymentId = '0000000000000000'
    const mockDeployment = { id: deploymentId, streamId: 'aaaaaaaaaaaa', deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
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
    const mockDeployment = { deployedAt: '2021-05-12T05:21:21.960Z', deploymentKey: '0000000000000000', deploymentType: 'audiomoth', stream: { id: streamId, project: { id: projectId } } }

    const spy = jest.spyOn(email, 'sendNewDeploymentSuccessEmail').mockReturnValue(Promise.resolve('Message sent'))
    setupMockAxios(GET, `${streamEndpoint}/${streamId}`, 200, mockStream)
    const response = await request(app).post('/').send(mockDeployment)

    expect(spy).toHaveBeenCalled()
    expect(response.statusCode).toBe(201)
  })

  test('create deployment success include new stream and project id', async () => {
    const streamHeaders = { location: `/${streamEndpoint}/aaaaaaaaaaaa` }
    const mockDeployment = { deployedAt: '2021-05-12T05:21:21.960Z', deploymentKey: '0000000000000000', deploymentType: 'audiomoth', stream: { name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb' } } }

    const spy = jest.spyOn(email, 'sendNewDeploymentSuccessEmail').mockReturnValue(Promise.resolve('Message sent'))
    setupMockAxios(POST, streamEndpoint, 201, null, streamHeaders)
    const response = await request(app).post('/').send(mockDeployment)

    expect(spy).toHaveBeenCalled()
    expect(response.statusCode).toBe(201)
  })

  test('create deployment failed with no deployment key', async () => {
    const mockDeployment = { deployedAt: '2021-05-12T05:21:21.960Z', deploymentType: 'audiomoth', stream: { name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb' } } }

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
    const mockDeployment = { deployedAt: '2021-05-12T05:21:21.960Z', deploymentKey: deploymentId, deploymentType: 'audiomoth', stream: { name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb' } } }
    const deployment = { id: deploymentId, streamId: 'aaaaaaaaaaaa', deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(deployment)

    const response = await request(app).post('/').send(mockDeployment)

    expect(response.statusCode).toBe(400)
  })

  test('create guardian deployment success without guid in deviceParameters', async () => {
    const streamHeaders = { location: `/${streamEndpoint}/aaaaaaaaaaaa` }
    const mockDeployment = { deployedAt: '2021-05-12T05:21:21.960Z', deploymentKey: '0000000000000000', deploymentType: 'guardian', stream: { name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb' } }, deviceParameters: { something: 'gggggggggggg' } }

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
    const mockDeployment = { deployedAt: '2021-05-12T05:21:21.960Z', deploymentKey: '0000000000000000', deploymentType: 'guardian', stream: { name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb' } }, deviceParameters: { guid: null } }

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
    const mockDeployment = { deployedAt: '2021-05-12T05:21:21.960Z', deploymentKey: '0000000000000000', deploymentType: 'guardian', stream: { name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb' } }, deviceParameters: { guid: 'gggggggggggg123' } }
    const expectedGuardianLogBody = { stream_id: 'aaaaaaaaaaaa', shortname: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project_id: 'bbbbbbbbbbbb', is_deployed: true, last_deployed: '2021-05-12T05:21:21.960Z' }

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
    const mockDeviceParameters = { guid: 'gggggggggggg', guardianToken: 'token', pinCode: 'pinCode' }
    const mockDeployment = { deployedAt: '2021-05-12T05:21:21.960Z', deploymentKey: '0000000000000000', deploymentType: 'guardian', stream: { name: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project: { id: 'bbbbbbbbbbbb' } }, deviceParameters: mockDeviceParameters }
    const expectedGuardianLogBody = { stream_id: 'aaaaaaaaaaaa', shortname: 'test-stream', latitude: -2.644, longitude: -46.56, altitude: 25, project_id: 'bbbbbbbbbbbb', is_deployed: true, last_deployed: '2021-05-12T05:21:21.960Z' }

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
    const mockDeployment = { deployedAt: '2021-05-12T05:21:21.960Z', deploymentKey: '0000000000000000', deploymentType: 'audiomoth', stream: { id: streamId, project: { id: 'bbbbbbbbbbbb' } } }

    setupMockAxios(PATCH, `${streamEndpoint}/${streamId}`, 201)
    const response = await request(app).patch(`/${deploymentId}`).send(mockDeployment)

    expect(response.statusCode).toBe(200)
  })

  test('patch deployment success with no stream', async () => {
    const deploymentId = '0000000000000000'
    const mockDeployment = { deployedAt: '2021-05-12T05:21:21.960Z', deploymentKey: '0000000000000000', deploymentType: 'audiomoth' }

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
    const deployment = { id: deploymentId, streamId: 'aaaaaaaaaaaa', deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(deployment)
    const mockUploadReturn = 'test-asset-id'

    const spy = jest.spyOn(service, 'uploadFileAndSaveToDb').mockReturnValue(Promise.resolve(mockUploadReturn))
    const response = await request(app).post(`/${deploymentId}/assets`).send(mockFile)

    expect(spy).toHaveBeenCalled()
    expect(response.statusCode).toBe(201)
    expect(response.headers.location).toEqual(`/assets/${mockUploadReturn}`)
  })
})

describe('GET /deployments', () => {
  test('get 1 deployment by stream id', async () => {
    const deploymentId = '0000000000000000'
    const mockDeployment = { id: deploymentId, streamId: 'aaaaaaaaaaaa', deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(mockDeployment)
    const streamId = 'aaaaaaaaaaaa'

    const response = await request(app).get(`?streamIds=${streamId}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveLength(1)
  })

  test('get 2 deployment by stream ids', async () => {
    const deploymentId1 = '0000000000000000'
    const deploymentId2 = '0000000000000001'
    const streamId1 = 'aaaaaaaaaaa1'
    const streamId2 = 'aaaaaaaaaaa2'
    const mockDeployment1 = { id: deploymentId1, streamId: streamId1, deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    const mockDeployment2 = { id: deploymentId2, streamId: streamId2, deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(mockDeployment1)
    await Deployment.create(mockDeployment2)

    const response = await request(app).get(`?streamIds=${streamId1}&streamIds=${streamId2}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveLength(2)
  })

  test('get deployments by audiomoth type', async () => {
    const deploymentId1 = '0000000000000000'
    const deploymentId2 = '0000000000000001'
    const streamId1 = 'aaaaaaaaaaa1'
    const streamId2 = 'aaaaaaaaaaa2'
    const mockDeployment1 = { id: deploymentId1, streamId: streamId1, deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    const mockDeployment2 = { id: deploymentId2, streamId: streamId2, deploymentType: 'guardian', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(mockDeployment1)
    await Deployment.create(mockDeployment2)

    const response = await request(app).get(`/`).query({ type: 'audiomoth'})

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveLength(1)
  })

  test('get deployments by guardian type', async () => {
    const deploymentId1 = '0000000000000000'
    const deploymentId2 = '0000000000000001'
    const streamId1 = 'aaaaaaaaaaa1'
    const streamId2 = 'aaaaaaaaaaa2'
    const mockDeployment1 = { id: deploymentId1, streamId: streamId1, deploymentType: 'guardian', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    const mockDeployment2 = { id: deploymentId2, streamId: streamId2, deploymentType: 'guardian', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(mockDeployment1)
    await Deployment.create(mockDeployment2)

    const response = await request(app).get(`/`).query({ type: 'guardian'})

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveLength(2)
  })

  test('get deployments by guardian type but empty', async () => {
    const deploymentId1 = '0000000000000000'
    const deploymentId2 = '0000000000000001'
    const streamId1 = 'aaaaaaaaaaa1'
    const streamId2 = 'aaaaaaaaaaa2'
    const mockDeployment1 = { id: deploymentId1, streamId: streamId1, deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    const mockDeployment2 = { id: deploymentId2, streamId: streamId2, deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(mockDeployment1)
    await Deployment.create(mockDeployment2)

    const response = await request(app).get(`/`).query({ type: 'guardian'})

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveLength(0)
  })

  test('get 2 deployment by project id', async () => {
    const deploymentId1 = '00000000000000A0'
    const deploymentId2 = '00000000000000B0'
    const streamId1 = 'aaaaaaaaaaa1'
    const streamId2 = 'aaaaaaaaaaa2'
    const mockDeployment1 = { id: deploymentId1, streamId: streamId1, deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    const mockDeployment2 = { id: deploymentId2, streamId: streamId2, deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(mockDeployment1)
    await Deployment.create(mockDeployment2)
    const mockStreamReturn = [{ id: streamId1}, { id: streamId2}] as StreamResponse[]

    const spy = jest.spyOn(api, 'getStreams').mockReturnValue(Promise.resolve(mockStreamReturn))
    const response = await request(app).get(`/`).query({ projectIds: ['000000000000']})

    expect(spy).toHaveBeenCalled()

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveLength(2)
    expect(response.body[0].id).toBe(deploymentId1)
    expect(response.body[0].streamId).toBe(streamId1)
    expect(response.body[1].id).toBe(deploymentId2)
    expect(response.body[1].streamId).toBe(streamId2)
  })

  test('get 2 deployment by project ids', async () => {
    const deploymentId1 = '00000000000000A1'
    const deploymentId2 = '00000000000000B1'
    const streamId1 = 'aaaaaaaaaaa1'
    const streamId2 = 'aaaaaaaaaaa2'
    const mockDeployment1 = { id: deploymentId1, streamId: streamId1, deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    const mockDeployment2 = { id: deploymentId2, streamId: streamId2, deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(mockDeployment1)
    await Deployment.create(mockDeployment2)
    const mockStreamReturn = [{ id: streamId1}, { id: streamId2}] as StreamResponse[]

    const spy = jest.spyOn(api, 'getStreams').mockReturnValue(Promise.resolve(mockStreamReturn))
    const response = await request(app).get(`/`).query({ projectIds: ['000000000000', '000000000001']})

    expect(spy).toHaveBeenCalled()

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveLength(2)
    expect(response.body[0].id).toBe(deploymentId1)
    expect(response.body[0].streamId).toBe(streamId1)
    expect(response.body[1].id).toBe(deploymentId2)
    expect(response.body[1].streamId).toBe(streamId2)
  })

  test('fail when get deployment with streamIds and projectIds', async () => {
    const deploymentId1 = '0000000000000000'
    const deploymentId2 = '0000000000000001'
    const streamId1 = 'aaaaaaaaaaa1'
    const streamId2 = 'aaaaaaaaaaa2'
    const mockDeployment1 = { id: deploymentId1, streamId: streamId1, deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    const mockDeployment2 = { id: deploymentId2, streamId: streamId2, deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: seedValues.primarySub }
    await Deployment.create(mockDeployment1)
    await Deployment.create(mockDeployment2)

    const response = await request(app).get(`/`).query({ streamIds: ['000000000000'], projectIds: ['000000000001']})

    expect(response.statusCode).toBe(400)
  })
})
