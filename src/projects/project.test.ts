import routes from './router'
import { migrate, truncate, expressApp, seed } from '../common/db/testing'
import request from 'supertest'
import db from '../common/db'
import { GET, POST, setupMockAxios } from '../common/axios/mock'

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

describe('POST /projects', () => {
  test('create a project to core', async () => {
    const headers = { location: `/${endpoint}/bbbbbbbbbbbb` }

    setupMockAxios(POST, endpoint, 201, null, headers)
    const response = await request(app).post('/')

    expect(response.statusCode).toBe(200)
  })
})
