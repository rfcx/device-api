import routes from './router'
import { migrate, truncate, expressApp, seed } from '../common/db/testing'
import request from 'supertest'
import dbConstructor from '../common/db'
import { GET, POST, setupMockAxios } from '../common/axios/mock'
import * as serializer from './serializer'
const db = dbConstructor('device')

const app = expressApp()

app.use('/', routes)

beforeAll(async () => {
  await migrate(db.sequelize)
  await seed()
})
beforeEach(async () => {
  await truncate()
})

const endpoint = 'projects'

describe('GET /projects', () => {
  test('get projects', async () => {
    const mockProject = [
      { id: 'bbbbbbbbbbbb', name: 'test-project-1', isPublic: true, externalId: null },
      { id: 'bbbbbbbbbbbc', name: 'test-project-2', isPublic: true, externalId: null }
    ]

    setupMockAxios(GET, endpoint, 200, mockProject)
    const response = await request(app).get('/')

    expect(response.statusCode).toBe(200)
    expect(response.body[0]).toEqual(mockProject[0])
    expect(response.body[1]).toEqual(mockProject[1])
  })

  test('get empty projects', async () => {
    setupMockAxios(GET, endpoint, 200, [])
    const response = await request(app).get('/')

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([])
  })
})

describe('GET /projects/:id', () => {
  test('get project by id', async () => {
    const projectId = 'bbbbbbbbbbbb'
    const mockProject = { id: 'bbbbbbbbbbbb', name: 'test-project-1', isPublic: true, externalId: null }

    setupMockAxios(GET, `${endpoint}/${projectId}`, 200, mockProject)
    const response = await request(app).get(`/${projectId}`)

    expect(response.statusCode).toBe(200)
  })
})

describe('GET /projects/:id/offtimes', () => {
  test('get project off times success', async () => {
    const offTimes = '00:00-01:00,03:10-04:30,05:15-05:25,06:40-08:30,09:00-09:15,12:15-13:30,15:10-16:20,18:25-20:20,20:55-21:15'
    const projectId = 'bbbbbbbbbbbb'
    const mockOffTimesReturn = {
      bbbbbbbbbbbb: offTimes
    }
    const mockResponse = {
      id: projectId,
      offTimes: offTimes
    }

    setupMockAxios(GET, `${endpoint}/${projectId}/offtimes`, 200, mockResponse)
    const spy = jest.spyOn(serializer, 'getOffTimes').mockReturnValue(Promise.resolve(mockOffTimesReturn))
    const response = await request(app).get(`/${projectId}/offtimes`)

    expect(spy).toHaveBeenCalled()
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(mockResponse)
  })
})

describe('POST /projects', () => {
  test('create a project to core', async () => {
    const headers = { location: `/${endpoint}/bbbbbbbbbbbb` }

    setupMockAxios(POST, endpoint, 201, null, headers)
    const response = await request(app).post('/')

    expect(response.statusCode).toBe(200)
  })
})
