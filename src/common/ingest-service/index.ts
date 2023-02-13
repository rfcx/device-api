import { getFileSha1 } from '../hash'
import { ingestInstance } from '../axios'
import { getToken } from '../auth'
import { AxiosResponse } from 'axios'
import { mapAxiosErrorToCustom } from '@rfcx/http-utils'
import { UploadIngestParams, UploadDetails, UploadPath } from '../types'

export const getUploadPath = async function (params: UploadIngestParams): Promise<UploadPath> {
  const checksum = await getFileSha1(params.filePath)
  const payload = { ...params, checksum }
  const token = await getToken()
  return await ingestInstance.post('/uploads', payload, { headers: { Authorization: token } })
    .then((response: AxiosResponse) => {
      const uploadDetails = response.data as UploadDetails
      return { bucket: uploadDetails.bucket, path: uploadDetails.path }
    })
    .catch(mapAxiosErrorToCustom)
}
