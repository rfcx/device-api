import routes from './router'
// import { expressApp } from '../common/db/testing'
import request from 'supertest'
// import { NONCmigrateORE, POST, setupMockAxios } from '../common/axios/mock'
import { migrate, truncateGuardian, expressApp, seedGuardian, seedValues } from '../common/db/testing'
import dbConstructor from '../common/db'
const db = dbConstructor('guardian')

const app = expressApp()

app.use('/', routes)

beforeAll(async () => {
  await migrate(db.sequelize, 'guardian')
  await seedGuardian()
})
afterAll(async () => {
  await truncateGuardian()
})

describe('POST /mqtt/user_path', () => {
  test('returns allow', async () => {
    const response = await request(app).post('/user_path').send({ username: seedValues.guardian1Guid, password: seedValues.guardian1Token })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('allow')
  })
  test('returns deny if guardian not found', async () => {
    const response = await request(app).post('/user_path').send({ username: 'randomguid', password: seedValues.guardian1Token })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if password is incorrect', async () => {
    const response = await request(app).post('/user_path').send({ username: seedValues.guardian1Guid, password: 'incorrect pwd' })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if username is absent', async () => {
    const response = await request(app).post('/user_path').send({ password: seedValues.guardian1Token })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if password is absent', async () => {
    const response = await request(app).post('/user_path').send({ username: seedValues.guardian1Guid })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if all params are absent', async () => {
    const response = await request(app).post('/user_path').send({ })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
})

describe('POST /mqtt/vhost_path', () => {
  test('returns allow', async () => {
    const response = await request(app).post('/vhost_path').send({ username: seedValues.guardian1Guid, vhost: 'host1', ip: 'localhost' })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('allow')
  })
  test('returns allow with different params', async () => {
    const response = await request(app).post('/vhost_path').send({ username: seedValues.guardian1Guid, vhost: 'host2', ip: 'localhost2' })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('allow')
  })
  test('returns deny if guardian not found', async () => {
    const response = await request(app).post('/vhost_path').send({ username: 'randomguid', vhost: 'host1', ip: 'localhost' })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if username is absent', async () => {
    const response = await request(app).post('/vhost_path').send({ vhost: 'host1', ip: 'localhost' })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if vhost is absent', async () => {
    const response = await request(app).post('/vhost_path').send({ username: 'randomguid', ip: 'localhost' })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if ip is absent', async () => {
    const response = await request(app).post('/vhost_path').send({ username: 'randomguid', vhost: 'host1' })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if all params are absent', async () => {
    const response = await request(app).post('/vhost_path').send({ })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
})

describe('POST /mqtt/resource_path', () => {
  test('returns allow', async () => {
    const response = await request(app).post('/resource_path').send({ username: seedValues.guardian1Guid, vhost: 'host1', resource: 'resource 1', name: 'name 1', permission: 'permission 1' })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('allow')
  })
  test('returns allow with different params', async () => {
    const response = await request(app).post('/resource_path').send({ username: seedValues.guardian1Guid, vhost: 'host2', resource: 'resource 2', name: 'name 2', permission: 'permission 2' })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('allow')
  })
  test('returns deny if guardian not found', async () => {
    const response = await request(app).post('/resource_path').send({ username: 'randomguid', vhost: 'host1', resource: 'resource 1', name: 'name 1', permission: 'permission 1' })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if username is absent', async () => {
    const response = await request(app).post('/resource_path').send({ vhost: 'host1', resource: 'resource 1', name: 'name 1', permission: 'permission 1' })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if vhost is absent', async () => {
    const response = await request(app).post('/resource_path').send({ username: seedValues.guardian1Guid, resource: 'resource 1', name: 'name 1', permission: 'permission 1' })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if resource is absent', async () => {
    const response = await request(app).post('/resource_path').send({ username: seedValues.guardian1Guid, vhost: 'host1', name: 'name 1', permission: 'permission 1' })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if name is absent', async () => {
    const response = await request(app).post('/resource_path').send({ username: seedValues.guardian1Guid, vhost: 'host1', resource: 'resource 1', permission: 'permission 1' })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if permission is absent', async () => {
    const response = await request(app).post('/resource_path').send({ username: seedValues.guardian1Guid, vhost: 'host1', resource: 'resource 1', name: 'name 1' })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
})

describe('POST /mqtt/topic_path', () => {
  test('returns allow for read permission', async () => {
    const response = await request(app).post('/topic_path').send({ username: seedValues.guardian1Guid, vhost: 'host1', resource: 'resource 1', name: 'name 1', permission: 'read', routing_key: `grd.${seedValues.guardian1Guid}.cmd` })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('allow')
  })
  test('returns allow for write permission for chk', async () => {
    const response = await request(app).post('/topic_path').send({ username: seedValues.guardian1Guid, vhost: 'host1', resource: 'resource 1', name: 'name 1', permission: 'write', routing_key: `grd.${seedValues.guardian1Guid}.chk` })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('allow')
  })
  test('returns allow for write permission for png', async () => {
    const response = await request(app).post('/topic_path').send({ username: seedValues.guardian1Guid, vhost: 'host1', resource: 'resource 1', name: 'name 1', permission: 'write', routing_key: `grd.${seedValues.guardian1Guid}.png` })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('allow')
  })
  test('returns deny if read permission is sent for chk', async () => {
    const response = await request(app).post('/topic_path').send({ username: seedValues.guardian1Guid, vhost: 'host1', resource: 'resource 1', name: 'name 1', permission: 'read', routing_key: `grd.${seedValues.guardian1Guid}.png` })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if read permission is sent for png', async () => {
    const response = await request(app).post('/topic_path').send({ username: seedValues.guardian1Guid, vhost: 'host1', resource: 'resource 1', name: 'name 1', permission: 'read', routing_key: `grd.${seedValues.guardian1Guid}.png` })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if write permission is sent for cmd', async () => {
    const response = await request(app).post('/topic_path').send({ username: seedValues.guardian1Guid, vhost: 'host1', resource: 'resource 1', name: 'name 1', permission: 'write', routing_key: `grd.${seedValues.guardian1Guid}.cmd` })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if permission is neither read nor write', async () => {
    const response = await request(app).post('/topic_path').send({ username: seedValues.guardian1Guid, vhost: 'host1', resource: 'resource 1', name: 'name 1', permission: 'listen', routing_key: `grd.${seedValues.guardian1Guid}.chk` })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if guardian not found', async () => {
    const response = await request(app).post('/topic_path').send({ username: 'randomguid', vhost: 'host1', resource: 'resource 1', name: 'name 1', permission: 'read', routing_key: `grd.${seedValues.guardian1Guid}.cmd` })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if username is absent', async () => {
    const response = await request(app).post('/topic_path').send({ vhost: 'host1', resource: 'resource 1', name: 'name 1', permission: 'read', routing_key: `grd.${seedValues.guardian1Guid}.cmd` })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if vhost is absent', async () => {
    const response = await request(app).post('/topic_path').send({ username: seedValues.guardian1Guid, resource: 'resource 1', name: 'name 1', permission: 'read', routing_key: `grd.${seedValues.guardian1Guid}.cmd` })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if resource is absent', async () => {
    const response = await request(app).post('/topic_path').send({ username: seedValues.guardian1Guid, vhost: 'host1', name: 'name 1', permission: 'read', routing_key: `grd.${seedValues.guardian1Guid}.cmd` })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if name is absent', async () => {
    const response = await request(app).post('/topic_path').send({ username: seedValues.guardian1Guid, vhost: 'host1', resource: 'resource 1', permission: 'read', routing_key: `grd.${seedValues.guardian1Guid}.cmd` })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if permission is absent', async () => {
    const response = await request(app).post('/topic_path').send({ username: seedValues.guardian1Guid, vhost: 'host1', resource: 'resource 1', name: 'name 1', routing_key: `grd.${seedValues.guardian1Guid}.cmd` })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
  test('returns deny if routing_key is absent', async () => {
    const response = await request(app).post('/topic_path').send({ username: seedValues.guardian1Guid, vhost: 'host1', resource: 'resource 1', name: 'name 1', permission: 'read' })
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('deny')
  })
})
