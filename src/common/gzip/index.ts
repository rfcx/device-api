import * as querystring from 'querystring'
import * as zlib from 'zlib'

export const unZipJson = async (gZippedJson: string): Promise<string> => {
  return await new Promise(function (resolve, reject) {
    try {
      zlib.unzip(
        Buffer.from(querystring.parse('gzipped=' + gZippedJson).gzipped as string, 'base64'),
        function (zLibError, zLibBuffer) {
          if (zLibError == null) {
            resolve(JSON.parse(zLibBuffer.toString()))
          } else {
            reject(new Error(zLibError.message))
          }
        })
    } catch (err) {
      reject(new Error(err))
    }
  })
}
