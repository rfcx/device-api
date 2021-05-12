import routes from './router'
import { migrate, truncate, expressApp, seed } from '../common/db/testing'
import request from 'supertest'
import { sequelize } from '../common/db'

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
  test('success', async () => {
    const response = await request(app).get('/')

    expect(response.statusCode).toBe(200)
  })
})
