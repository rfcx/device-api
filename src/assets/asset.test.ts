import routes from './router'
import { migrate, truncate, expressApp, seed } from '../common/db/testing'
import request from 'supertest'
import db from '../common/db'
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

describe('DELETE /assets/:id', () => {
  test('delete assets success', async () => {
    const mockAsset = { fileName: 'test-file', mimeType: 'image/jpeg', streamId: 'aaaaaaaaaaaa', deploymentId: '0000000000000000' }
    const asset = await Asset.create(mockAsset)

    const response = await request(app).delete(`/${asset.id}`)
    expect(response.statusCode).toBe(204)
  })

  test('delete not existing asset', async () => {
    const assetId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'

    const response = await request(app).delete(`/${assetId}`)
    expect(response.statusCode).toBe(404)
    expect(response.text).toEqual('Not found')
  })
})
