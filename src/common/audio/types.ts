import { Dayjs } from 'dayjs'

export type AudioMime = 'audio/ogg' | 'audio/flac' | 'audio/wav' | 'audio/mp4' | 'audio/mpeg' | 'audio/mp4'
export type AudioFormat = 'mp3' | 'opus' | 'wav' | 'flac' | 'm4a'
export interface AudioTranscodeParams {
  sourceFilePath: string
  enhanced?: boolean
  copyCodecInsteadOfTranscode?: boolean
  clipOffset?: number
  clipDuration?: number
  sampleRate?: number
  keepFile?: boolean
}

export interface AudioFileMeta {
  size: number
  measuredAt: Dayjs
  sha1CheckSum: string
  sampleRate: number
  bitRate: number
  audioCodec: string
  fileExtension: string
  isVbr: boolean
  encodeDuration: number
  mimeType: AudioMime | null
  captureSampleCount: number
}
