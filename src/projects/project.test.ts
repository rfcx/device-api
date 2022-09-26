import routes from './router'
import { migrate, truncate, expressApp, seed } from '../common/db/testing'
import request from 'supertest'
import db from '../common/db'
import { GET, POST, setupMockAxios } from '../common/axios/mock'
import * as serializer from './serializer'

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
    const offTimes = '00:00-01:00,03:10-04:30,05:15-05:25,06:40-08:30,09:00-09:15,12:15-13:30,15:10-16:20,18:25-20:20,20:55-21:15'
    const mockGetFileReturn = {
      aaaaaaaaaaaa: offTimes
    }
    const mockProject = [
      { id: 'bbbbbbbbbbbb', name: 'test-project-1', isPublic: true, externalId: null },
      { id: 'bbbbbbbbbbbc', name: 'test-project-2', isPublic: true, externalId: null }
    ]

    setupMockAxios(GET, endpoint, 200, mockProject)
    const spy = jest.spyOn(serializer, 'getOffTimes').mockReturnValue(Promise.resolve(mockGetFileReturn))
    const response = await request(app).get('/')

    expect(spy).toHaveBeenCalled()
    expect(response.statusCode).toBe(200)
    expect(response.body[0]).toEqual(mockProject[0])
    expect(response.body[1]).toEqual(mockProject[1])
  })

  test('get empty projects', async () => {
    setupMockAxios(GET, endpoint, 200, [])
    const spy = jest.spyOn(serializer, 'getOffTimes').mockReturnValue(Promise.resolve())
    const response = await request(app).get('/')

    expect(spy).toHaveBeenCalled()
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([])
  })

  test('get projects with offtimes', async () => {
    const offTimes = '00:00-01:00,03:10-04:30,05:15-05:25,06:40-08:30,09:00-09:15,12:15-13:30,15:10-16:20,18:25-20:20,20:55-21:15'
    const mockGetFileReturn = {
      bbbbbbbbbbbb: offTimes
    }
    const mockProject = [
      { id: 'bbbbbbbbbbbb', name: 'test-project-1', isPublic: true, externalId: null, offTimes: offTimes }
    ]

    setupMockAxios(GET, endpoint, 200, mockProject)
    const spy = jest.spyOn(serializer, 'getOffTimes').mockReturnValue(Promise.resolve(mockGetFileReturn))
    const response = await request(app).get('/')

    expect(spy).toHaveBeenCalled()
    expect(response.statusCode).toBe(200)
    expect(response.body[0]).toEqual(mockProject[0])
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

  test('get project by id with offtimes', async () => {
    const offTimes = '00:00-01:00,03:10-04:30,05:15-05:25,06:40-08:30,09:00-09:15,12:15-13:30,15:10-16:20,18:25-20:20,20:55-21:15'
    const mockGetFileReturn = {
      bbbbbbbbbbbb: offTimes
    }
    const projectId = 'bbbbbbbbbbbb'
    const mockProject = { id: 'bbbbbbbbbbbb', name: 'test-project-1', isPublic: true, externalId: null, offTimes: offTimes }

    setupMockAxios(GET, `${endpoint}/${projectId}`, 200, mockProject)
    const spy = jest.spyOn(serializer, 'getOffTimes').mockReturnValue(Promise.resolve(mockGetFileReturn))
    const response = await request(app).get(`/${projectId}`)

    expect(spy).toHaveBeenCalled()
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(mockProject)
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
