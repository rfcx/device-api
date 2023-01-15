export interface MqttMessageBuffers {
  json: Buffer
  audio: Buffer | null
  screenshot: Buffer | null
  log: Buffer | null
}

export interface Classifier {
  guid: string
  id: string | number
}

export interface MqttMessageJson {
  checkins: string
  audio: string
  queued_at: number | string
  cpu: string
  network: string
  memory: string
  sentinel_power: string
  purged: string
  software: string
  prefs: {
    sha1: string
  }
  measured_at: number | string
  battery: string
  library: {
    audio: object[]
    classifiers: Classifier[]
  }
  reboots: string
  meta_ids?: string[]
  data_transfer: string
  storage: string
  guardian?: {
    guid?: string
    token?: string
  }
  broker_connections?: string
  detections?: string
  device?: string
  messages?: string
  detection_ids?: string[]
  checkins_to_verify?: string[]
}

export * from './utils/types'
