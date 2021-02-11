const models = require('../../../modelsTimescale')
import { Stream } from '../../types'

export const createStream = async (uid: string, stream: Stream, projectId: string) => {
    if (!stream.id) { return Promise.reject('Failed on create stream') }
    const streamData = {
        id: stream.id,
        name: stream.name,
        latitude: stream.latitude,
        longitude: stream.longitude,
        altitude: stream.altitude,
        project_id: projectId,
        created_by_id: uid
    }
    try {
        const result = await models.Stream.create(streamData)
        if(result) {
            return result.id
        }
        return Promise.reject('Failed on create stream')
    } catch(error) {
        return Promise.reject(error)
    }
}

export const updateStream = async (uid: string, stream: Stream) => {
    // if (!stream.coreId) { return Promise.reject('Failed on update stream') }
    // const query = database.collection('users').doc(uid).collection('streams').doc(stream.coreId)
    // try {
    //     const result = await query.update(stream)
    //     if(result) {
    //         return Promise.resolve('Success')
    //     }
    //     return Promise.reject('Failed on update stream')
    // } catch(error) {
    //     return Promise.reject(error)
    // }
}
