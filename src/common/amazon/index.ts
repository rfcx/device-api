import AWS from 'aws-sdk'
import config from '../../config'
import { PromiseResult } from 'aws-sdk/lib/request'

const credentials = {
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_KEY,
  region: config.AWS_REGION_ID
}

AWS.config.update(credentials)
const s3Client = new AWS.S3({
  signatureVersion: 'v4'
})

export const uploadFile = async (remotePath: string, buffer: Buffer, opt?: { ContentEncoding: string }): Promise<PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>> => {
  let params: AWS.S3.PutObjectRequest = {
    Bucket: 'rfcx-device-assets-staging',
    Key: remotePath,
    Body: buffer
  }

  if (opt != null) {
    params = { ...params, ...opt }
  }

  return await s3Client.putObject(params).promise()
}
