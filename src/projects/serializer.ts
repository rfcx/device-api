import { ProjectOffTimes } from '../types'
import { getFile } from '../common/storage'

export const getOffTimes = async (): Promise<any> => {
  return await getFile('satellite-offtimes.json')
}

export const getOfftimeByProjectId = async (id: string): Promise<ProjectOffTimes | {}> => {
  const offTimes = await getOffTimes()
  const projectOffTime = offTimes[id]
  if (projectOffTime === undefined) {
    return {}
  }
  const offtime = {
    id: id,
    offTimes: projectOffTime
  }
  return offtime as ProjectOffTimes
}
