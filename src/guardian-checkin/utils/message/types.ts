import { MqttMessageJson } from '../../../mqtt/types'

export interface MqttReturnObject {
  obj: {
    checkin_id: number | null
    audio: object[]
    meta: object[]
    screenshots: object[]
    logs: object[]
    photos: object[]
    videos: object[]
    messages: object[]
    apks: object[]
    detections: object[]
    classifiers: object[]
    instructions: object[]
    prefs: object[]
    segments: object[]
    snippets: object[]
    purged: object[]
    received: object[]
    unconfirmed: object[]
  }
}

export interface GuardianMessageAbbr {
  fields: {
    audio: string
    meta: string
    screenshots: string
    logs: string
    photos: string
    videos: string
    messages: string
    apks: string
    detections: string
    classifiers: string
    instructions: string
    prefs: string
    segments: string
    snippets: string
    purged: string
    received: string
    unconfirmed: string
  }
}

export interface GuardianMessageObject {
  json: MqttMessageJson
  meta: {
    guardian: object
    allow_without_auth_token: boolean
    startTime: Date
  }
  audio: object
  screenshots: object
  logs: object
  rtrn: MqttReturnObject
  abbr: GuardianMessageAbbr
}
