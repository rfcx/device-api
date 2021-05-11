import routes from './router'
import { expressApp } from '../common/db/testing'
import request from 'supertest'

const app = expressApp()

app.use('/', routes)

describe('GET /streams', () => {
  test('no results', async () => {
    const response = await request(app).get('/')

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([])
  })

  test('success', async () => {
    const response = await request(app).get('/')

    expect(response.statusCode).toBe(200)
  })
})
