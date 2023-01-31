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

export interface GuardianAndroidMetaAbbr {
  p: string | undefined
  br: string | undefined
  m: string | undefined
  bu: string | undefined
  a: string | undefined
  mf: string | undefined
}

export interface GuardianPhoneMetaAbbr {
  s: string | undefined
  n: string | undefined
  imei: string | undefined
  imsi: string | undefined
}

export interface GuardianDeviceMetaAbbr {
  a: GuardianAndroidMetaAbbr | undefined
  p: GuardianPhoneMetaAbbr | undefined
}

export interface GuardianAndroidMeta {
  product: string | undefined
  brand: string | undefined
  model: string | undefined
  build: string | undefined
  android: string | undefined
  manufacturer: string | undefined
}

export interface GuardianPhoneMeta {
  sim: string | undefined
  number: string | undefined
  imei: string | undefined
  imsi: string | undefined
}

export interface GuardianDeviceMeta {
  android: GuardianAndroidMeta | undefined
  phone: GuardianPhoneMeta | undefined
}
