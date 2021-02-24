import Asset from '../assets/asset.model'
import { validate as uuidValidate } from 'uuid'

export async function create (fileName: string, streamId: string, deploymentId: string): Promise<Asset> {
  const asset = { fileName, streamId, deploymentId }
  return await Asset.create(asset)
}

export async function get (id: string): Promise<Asset | null> {
  if (!uuidValidate(id)) {
    return null
  }
  return await Asset.findByPk(id)
}

export async function query (filters: { streamId?: string, deploymentId?: string }, options: { limit?: number, offset?: number } = {}): Promise<Asset[]> {
  return await Asset.findAll({
    where: filters,
    limit: options.limit ?? 100,
    offset: options.offset ?? 0,
    attributes: {
      exclude: ['fileName', 'streamId', 'deploymentId', 'updatedAt']
    }
  })
}

export default { create, get, query }
