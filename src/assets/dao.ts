import Asset from '../assets/asset.model'
import { validate as uuidValidate } from 'uuid'
import { NewAsset } from '../types'

export async function create (newAsset: NewAsset): Promise<Asset> {
  return await Asset.create(newAsset)
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

export async function remove (id: string): Promise<number> {
  return await Asset.destroy({ where: { id: id } })
}

export default { create, get, query, remove }
