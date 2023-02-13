import * as querystring from 'querystring'
import { gunzip } from 'zlib'
import { promisify } from 'util'

const gunzipAsync = promisify(gunzip)

export const unZipJson = async (gZippedJson: string): Promise<string> => {
  const unzippedJson = await gunzipAsync(Buffer.from(querystring.parse('gzipped=' + gZippedJson).gzipped as string, 'base64'))
  return JSON.parse(unzippedJson.toString('utf-8'))
}
