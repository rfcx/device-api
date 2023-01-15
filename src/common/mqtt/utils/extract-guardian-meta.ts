import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { parseMqttStrArr } from './parse-mqtt-str-arr'
import {
  GuardianCheckInStatusMeta,
  GuardianMqttBrokerConnectionMeta,
  GuardianCPUMeta,
  GuardianMemoryMeta,
  GuardianAssetExchangeLogMeta,
  GuardianAssetExchangeLogMetaList,
  GuardianSoftwareMeta,
  GuardianRebootsMeta,
  GuardianBatteryMeta,
  GuardianDataTransferMeta,
  GuardianStorageMeta,
  MqttMessageJson
} from '../../types'

dayjs.extend(utc)

export const compactKeysSoftwareRole = { g: 'guardian', a: 'admin', c: 'classify', u: 'updater' }
export const compactKeysStorage = { i: 'internal', e: 'external' }
export const compactKeysMemory = { s: 'system' }
export const compactKeysSentinelPower = { s: 'system', i: 'input', b: 'battery' }
export const compactKeysCheckIns = { s: 'sent', q: 'queued', m: 'meta', sk: 'skipped', st: 'stashed', a: 'archived', v: 'vault' }

export const parseCheckinStatusMeta = function (metaStr: string): GuardianCheckInStatusMeta {
  const metaArr = parseMqttStrArr(metaStr)
  return metaArr.reduce((acc, item) => {
    const typeRaw = item[0]
    const type: string = compactKeysCheckIns[typeRaw] !== undefined ? compactKeysCheckIns[typeRaw] : typeRaw
    acc[`${type}Count`] = parseInt(item[1])
    if (item[2] != null) {
      acc[`${type}SizeBytes`] = parseInt(item[2])
    }
    return acc
  }, {}) as GuardianCheckInStatusMeta
}

export const parseBrokerConnectionsMeta = function (metaStr: string): GuardianMqttBrokerConnectionMeta[] {
  const metaArr = parseMqttStrArr(metaStr)
  return metaArr.reduce((acc: GuardianMqttBrokerConnectionMeta[], item: string[]) => {
    if (item[3] != null) {
      acc.push({
        connectedAt: dayjs(parseInt(item[0])).toISOString(),
        connectionLatency: parseInt(item[1]),
        subscriptionLatency: parseInt(item[2]),
        brokerUri: item[3]
      })
    }
    return acc
  }, [])
}

export const parseCPUMeta = function (metaStr: string): GuardianCPUMeta[] {
  const metaArr = parseMqttStrArr(metaStr)
  return metaArr.reduce((acc: GuardianCPUMeta[], item: string[]) => {
    const cpuPercent = parseInt(item[1])
    const cpuClock = parseInt(item[2])
    if (cpuPercent >= 0 && cpuPercent <= 100 && cpuClock >= 0 && cpuClock <= 5000) {
      acc.push({
        measuredAt: dayjs(parseInt(item[0])).toISOString(),
        cpuClock,
        cpuPercent
      })
    }
    return acc
  }, [])
}

export const parseMemoryMeta = function (metaStr: string): GuardianMemoryMeta[] {
  const metaArr = parseMqttStrArr(metaStr)
  return metaArr.reduce((acc: GuardianMemoryMeta[], item: string[]) => {
    const typeRaw = item[0]
    const type: string = compactKeysMemory[typeRaw] !== undefined ? compactKeysMemory[typeRaw] : typeRaw
    if (type === 'system') {
      acc.push({
        measuredAt: dayjs(parseInt(item[1])).toISOString(),
        systemBytesUsed: parseInt(item[2]),
        systemBytesAvailable: parseInt(item[3]),
        systemBytesMinimum: parseInt(item[4])
      })
    }
    return acc
  }, [])
}

export const parseAssetExchangeLog = function (metaStr: MqttMessageJson): GuardianAssetExchangeLogMetaList {
  const meta = metaStr.meta_ids !== undefined ? metaStr.meta_ids.map((assetId: string) => { return { assetType: 'meta', assetId } }) : []
  const detections = metaStr.detection_ids !== undefined ? metaStr.detection_ids.map((assetId: string) => { return { assetType: 'detections', assetId } }) : []
  const audio = metaStr.checkins_to_verify !== undefined ? metaStr.checkins_to_verify.map((assetId: string) => { return { assetType: 'audio', assetId } }) : []

  let purged: GuardianAssetExchangeLogMeta[] = []
  if (metaStr.purged !== undefined) {
    const purgedArr = parseMqttStrArr(metaStr.purged)
    purged = purgedArr.reduce((acc: GuardianAssetExchangeLogMeta[], item: string[]) => {
      acc.push({
        assetType: item[0],
        assetId: item[1]
      })
      return acc
    }, [])
  }

  return { meta, detections, audio, purged }
}

export const parseSoftwareMeta = function (metaStr: string): GuardianSoftwareMeta {
  const metaArr = parseMqttStrArr(metaStr)
  return metaArr.reduce((acc: object, item: string[]) => {
    const typeRaw = item[0]
    const type: string = compactKeysSoftwareRole[typeRaw] !== undefined ? compactKeysSoftwareRole[typeRaw] : typeRaw
    acc[type] = item[1]
    return acc
  }, {}) as GuardianSoftwareMeta
}

export const parseRebootsMeta = function (metaStr: string): GuardianRebootsMeta[] {
  const metaArr = parseMqttStrArr(metaStr)
  return metaArr.reduce((acc: GuardianRebootsMeta[], item: string[]) => {
    acc.push({
      completedAt: dayjs(parseInt(item[0])).toISOString()
    })
    return acc
  }, [])
}

export const parseBatteryMeta = function (metaStr: string): GuardianBatteryMeta[] {
  const metaArr = parseMqttStrArr(metaStr)
  return metaArr.reduce((acc: GuardianBatteryMeta[], item: string[]) => {
    acc.push({
      measuredAt: dayjs(parseInt(item[0])).toISOString(),
      batteryPercent: parseInt(item[1]),
      batteryTemperature: parseInt(item[2]),
      isCharging: (item[3] === '1') ? true : ((item[3] === '0') ? false : null)
    })
    return acc
  }, [])
}

export const parseDataTransferMeta = function (metaStr: string): GuardianDataTransferMeta[] {
  const metaArr = parseMqttStrArr(metaStr)
  return metaArr.reduce((acc: GuardianDataTransferMeta[], item: string[]) => {
    const networkBytesRx = (item[6] == null) ? 0 : parseInt(item[6])
    const networkBytesTx = (item[7] == null) ? 0 : parseInt(item[7])
    const networkTotalBytesRx = (item[8] == null) ? 0 : parseInt(item[8])
    const networkTotalBytesTx = (item[9] == null) ? 0 : parseInt(item[9])
    acc.push({
      startedAt: dayjs(parseInt(item[0])).toISOString(),
      endedAt: dayjs(parseInt(item[1])).toISOString(),

      mobileBytesReceived: parseInt(item[2]),
      mobileBytesSent: parseInt(item[3]),
      mobileTotalBytesReceived: parseInt(item[4]),
      mobileTotalBytesSent: parseInt(item[5]),

      networkBytesReceived: networkBytesRx,
      networkBytesSent: networkBytesTx,
      networkTotalBytesReceived: networkTotalBytesRx,
      networkTotalBytesSent: networkTotalBytesTx,

      bytesReceived: parseInt(item[2]) + networkBytesRx,
      bytesSent: parseInt(item[3]) + networkBytesTx,
      totalBytesReceived: parseInt(item[4]) + networkTotalBytesRx,
      totalBytesSent: parseInt(item[5]) + networkTotalBytesTx
    })
    return acc
  }, [])
}

export const parseStorageMeta = function (metaStr: string): GuardianStorageMeta[] {
  const metaArr = parseMqttStrArr(metaStr)
  const groupedMetas: any[] = metaArr.reduce((acc: any, item: string[]) => {
    const typeRaw = item[0]
    const type: string = compactKeysStorage[typeRaw] !== undefined ? compactKeysStorage[typeRaw] : typeRaw
    const measuredAt = item[1]
    if (acc[measuredAt] === undefined) {
      acc[measuredAt] = {}
    }
    acc[`${measuredAt}`][`${type}BytesUsed`] = parseInt(item[2])
    acc[`${measuredAt}`][`${type}BytesAvailable`] = parseInt(item[3])
    return acc
  }, {})
  return Object.keys(groupedMetas)
    .map((timestamp: string): GuardianStorageMeta => {
      return {
        measuredAt: dayjs(parseInt(timestamp)).toISOString(),
        ...groupedMetas[timestamp]
      }
    })
}

export const extractGuardianMeta = function (json: MqttMessageJson): unknown {
  const checkinStatus = parseCheckinStatusMeta(json.checkins)
  const brokerConnections = json.broker_connections !== undefined ? parseBrokerConnectionsMeta(json.broker_connections) : null
  const cpu = json.cpu !== undefined ? parseBrokerConnectionsMeta(json.cpu) : null
  const memory = json.memory !== undefined ? parseMemoryMeta(json.memory) : null
  const assetExchange = parseAssetExchangeLog(json)
  const software = json.software !== undefined ? parseSoftwareMeta(json.software) : null
  const reboots = json.reboots !== undefined ? parseSoftwareMeta(json.reboots) : null
  const battery = json.battery !== undefined ? parseSoftwareMeta(json.battery) : null
  const dataTransfer = json.data_transfer !== undefined ? parseSoftwareMeta(json.data_transfer) : null
  const storage = json.storage !== undefined ? parseSoftwareMeta(json.storage) : null
  return {
    checkinStatus,
    brokerConnections,
    cpu,
    memory,
    assetExchange,
    software,
    reboots,
    battery,
    dataTransfer,
    storage
  }
}
