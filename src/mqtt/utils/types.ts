export interface GuardianCheckInStatusMeta {
  sentCount: number
  sentSizeBytes: number
  queuedCount: number
  queuedSizeBytes: number
  metaCount: number
  metaSizeBytes: number
  skippedCount: number
  skippedSizeBytes: number
  stashedCount: number
  stashedSizeBytes: number
  archivedCount: number
  archivedSizeBytes: number
  vaultCount: number
  vaultSizeBytes: number
}

export interface GuardianMqttBrokerConnectionMeta {
  connectedAt: string
  connectionLatency: number
  subscriptionLatency: number
  brokerUri: string
}

export interface GuardianCPUMeta {
  measuredAt: string
  cpuPercent: number
  cpuClock: number
}

export interface GuardianMemoryMeta {
  measuredAt: string
  systemBytesAvailable: number
  systemBytesUsed: number
  systemBytesMinimum: number
}

export interface GuardianAssetExchangeLogMeta {
  assetType: string
  assetId: string
}

export interface GuardianAssetExchangeLogMetaList {
  meta: GuardianAssetExchangeLogMeta[]
  detections: GuardianAssetExchangeLogMeta[]
  audio: GuardianAssetExchangeLogMeta[]
  purged: GuardianAssetExchangeLogMeta[]
}

export interface GuardianSoftwareMeta {
  guardian?: string
  admin?: string
  classify?: string
  updater?: string
  cputuner?: string
  api?: string
  audio?: string
  carrier?: string
  connect?: string
  reboot?: string
  system?: string
  sentinel?: string
  setup?: string
  moduleloader?: string
  encode?: string
  'updater-cli'?: string
  'guardian-cli'?: string
}

export interface GuardianRebootsMeta {
  completedAt: string
}

export interface GuardianBatteryMeta {
  measuredAt: string
  batteryPercent: number
  batteryTemperature: number
  isCharging: boolean | null
}

export interface GuardianDataTransferMeta {
  startedAt: string
  endedAt: string
  mobileBytesReceived: number
  mobileBytesSent: number
  mobileTotalBytesReceived: number
  mobileTotalBytesSent: number
  networkBytesReceived: number
  networkBytesSent: number
  networkTotalBytesReceived: number
  networkTotalBytesSent: number
  bytesReceived: number
  bytesSent: number
  totalBytesReceived: number
  totalBytesSent: number
}

export interface GuardianStorageMeta {
  measuredAt: string
  internalBytesAvailable: number
  internalBytesUsed: number
  externalBytesAvailable: number
  externalBytesUsed: number
}