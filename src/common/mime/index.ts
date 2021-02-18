import fileType, { FileTypeResult } from 'file-type'

export const getFileTypeFromBase64 = async (base64: string): Promise<FileTypeResult | undefined> => {
  return await fileType.fromBuffer(Buffer.from(base64, 'base64'))
}
