export interface UploadIngestParams {
  filename: string
  filePath: string
  stream: string
  timestamp: string
  sampleRate: number
  targetBitrate: number
}

export interface UploadDetails {
  uploadId: string
  url: string
  path: string
  bucket: string
}

export interface UploadPath {
  path: string
  bucket: string
}
