import AWS from 'aws-sdk'
import config from '../../config'
import { PromiseResult } from 'aws-sdk/lib/request'
import { Readable } from 'stream'
import { readFileAsync } from '../fs'

const credentials = {
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_KEY,
  region: config.AWS_REGION_ID
}

AWS.config.update(credentials)
const s3Client = new AWS.S3({
  signatureVersion: 'v4'
})

export const uploadFile = async (remotePath: string, file: string | Buffer, bucket: string = config.AWS_S3_BUCKET): Promise<PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>> => {
  const buffer = Buffer.isBuffer(file) ? file : await readFileAsync(file)
  const params: AWS.S3.PutObjectRequest = {
    Bucket: bucket,
    Key: remotePath,
    Body: buffer
  }
  return await s3Client.putObject(params).promise()
}

export function downloadAsStream (remotePath: string): Readable {
  const params: AWS.S3.GetObjectRequest = {
    Bucket: config.AWS_S3_BUCKET,
    Key: remotePath
  }
  return s3Client.getObject(params).createReadStream()
}

export const getJsonFile = async (remotePath: string): Promise<any> => {
  const params: AWS.S3.GetObjectRequest = {
    Bucket: config.AWS_S3_BUCKET,
    Key: remotePath
  }
  const result = await s3Client.getObject(params).promise()
  const json = JSON.parse(result.Body?.toString('utf8') ?? '{}')
  return json
}
