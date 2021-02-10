import { Stream } from '../../types'

export const createStream = async (uid: string, stream: Stream, streamId: string | null) => {
    // if (!streamId) { return Promise.reject('Failed on create stream') }
    // const query = database.collection('users').doc(uid).collection('streams').doc(streamId)
    // try {
    //     const result = await query.set(stream)
    //     if(result) {
    //         return Promise.resolve('Success')
    //     }
    //     return Promise.reject('Failed on create stream')
    // } catch(error) {
    //     return Promise.reject(error)
    // }
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
