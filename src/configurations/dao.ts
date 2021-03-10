import { NewConfiguration, UpdateConfigurationRequest } from '../types'
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

export const update = async (uid: string, configuration: UpdateConfigurationRequest): Promise<string> => {
  try {
    const { id, ...data } = configuration
    const result = await Configuration.update(data, { where: { id: id } })
    if (result != null) {
      return await Promise.resolve('Update Success')
    }
    return await Promise.reject(new Error('Failed on update Configuration'))
  } catch (error) {
    return await Promise.reject(error)
  }
}

export default { create, update }
