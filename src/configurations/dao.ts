import { NewConfiguration, UpdateConfigurationRequest } from '../types'
import Configuration from './configuration.model'

export const create = async (configuration: NewConfiguration): Promise<number> => {
    const result = await Configuration.create(configuration)
    if (result != null) {
      return result.id
    }
    throw new Error('Failed on create Configuration')
}

export const update = async (uid: string, configuration: UpdateConfigurationRequest): Promise<string> => {
    const { id, ...data } = configuration
    const result = await Configuration.update(data, { where: { id: id } })
    if (result != null) {
      return await Promise.resolve('Update Success')
    }
    throw new Error('Failed on update Configuration')
}

export default { create, update }
