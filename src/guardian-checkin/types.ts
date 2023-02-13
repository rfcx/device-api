import {
  GuardianCheckInStatusMeta,
  GuardianMqttBrokerConnectionMeta,
  GuardianCPUMeta,
  GuardianMemoryMeta,
  GuardianAssetExchangeLogMetaList,
  GuardianRebootsMeta,
  GuardianBatteryMeta,
  GuardianDataTransferMeta,
  GuardianDiskUsageMeta,
  GuardianSoftwareMeta,
  GuardianAuthInfo,
  AudioFileMeta
} from '../types'

export interface GuardianCheckinCreatable {
  guardianId: number
  siteId: number
  measuredAt: Date
  queuedAt: Date
}

export interface GuardianCheckinUpdatable {
  requestLatencyApi?: number
  requestLatencyGuardian?: number
  requestSize?: number
}

// export interface GuardianMeta {
//   checkinStatus: GuardianMetaCheckInStatus
//   brokerConnections: GuardianMetaMqttBrokerConnection[]
//   cpu: GuardianMetaCPU[]
//   memory: GuardianMetaMemory[]
//   assetExchange: {
//     meta: GuardianMetaAssetExchangeLog[]
//     detections: GuardianMetaAssetExchangeLog[]
//     audio: GuardianMetaAssetExchangeLog[]
//     purged: GuardianMetaAssetExchangeLog[]
//   }
//   software: GuardianSoftwareMeta
//   reboots: unknown
//   battery: GuardianMetaBattery
//   dataTransfer: GuardianMetaDataTransfer
//   diskUsage: GuardianMetaDiskUsage
// }

export interface GuardianMeta {
  checkinStatus: GuardianCheckInStatusMeta | null
  brokerConnections: GuardianMqttBrokerConnectionMeta[] | null
  cpu: GuardianCPUMeta[] | null
  memory: GuardianMemoryMeta[] | null
  assetExchange: GuardianAssetExchangeLogMetaList | null
  software: GuardianSoftwareMeta | null
  reboots: GuardianRebootsMeta[] | null
  battery: GuardianBatteryMeta[] | null
  dataTransfer: GuardianDataTransferMeta[] | null
  diskUsage: GuardianDiskUsageMeta[] | null
  guardian: GuardianAuthInfo
}

export interface CheckinMessageParsed {
  guardian: {
    meta: GuardianMeta
  }
  audio: {
    path: string
    // TODO: define based on received content
    meta: unknown
  } | null
}

// export interface CheckinPayload {
//   guardianId: string
//   checkin: GuardianCheckinCreatable
// }
export interface CheckinGuardianPayload {
  guid: string
  token: string
  meta: GuardianMeta
}

export interface CheckinAudioPayload {
  meta: AudioFileMeta
  path: string
}

export interface CheckinPayload {
  guardian: CheckinGuardianPayload
  audio: CheckinAudioPayload | null
}

export * from './utils/message/types'
