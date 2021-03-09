import { NewConfiguration } from '../types'
import Configuration from './configuration.model'

export const create = async (configuration: NewConfiguration): Promise<number> => {
  try {
    const result = await Configuration.create(configuration)
    if (result != null) {
      return result.id
    }
    return await Promise.reject(new Error('Failed on create Configuration'))
  } catch (error) {
    return await Promise.reject(error)
  }
}

export default { create }
