import { muteConsole } from '../../db/testing'
import {
  parseCheckinStatusMeta,
  parseBrokerConnectionsMeta,
  parseCPUMeta,
  parseMemoryMeta,
  parseSoftwareMeta,
  parseRebootsMeta,
  parseAssetExchangeLog,
  parseBatteryMeta,
  parseDataTransferMeta,
  parseStorageMeta
} from './extract-guardian-meta'

beforeAll(() => {
  muteConsole(['info'])
})

describe('parseCheckinStatusMeta function', () => {
  test('should return correct data', () => {
    const meta = parseCheckinStatusMeta('sent*2*285384*1673027801900*1673027984198|queued*17*1646647|meta*56*28233|skipped*2*279592|stashed*0*0|archived*35*5015552|vault*0*0')
    expect(meta.sentCount).toBe(2)
    expect(meta.sentSizeBytes).toBe(285384)
    expect(meta.queuedCount).toBe(17)
    expect(meta.queuedSizeBytes).toBe(1646647)
    expect(meta.metaCount).toBe(56)
    expect(meta.metaSizeBytes).toBe(28233)
    expect(meta.skippedCount).toBe(2)
    expect(meta.skippedSizeBytes).toBe(279592)
    expect(meta.stashedCount).toBe(0)
    expect(meta.stashedSizeBytes).toBe(0)
    expect(meta.archivedCount).toBe(35)
    expect(meta.archivedSizeBytes).toBe(5015552)
    expect(meta.vaultCount).toBe(0)
    expect(meta.vaultSizeBytes).toBe(0)
  })
})

describe('parseBrokerConnectionsMeta function', () => {
  test('should return correct data', () => {
    const meta = parseBrokerConnectionsMeta('1673029487813*8278*418*ssl://staging-api-mqtt.rfcx.org:8883|1673029589966*3635*469*ssl://staging-api-mqtt.rfcx.org:8883|1673029589966*3635*469*ssl://staging-api-mqtt.rfcx.org:8883|1673029589966*3635*469*ssl://staging-api-mqtt.rfcx.org:8883|1673029589966*3635*469*ssl://staging-api-mqtt.rfcx.org:8883|1673029589966*3635*469*ssl://staging-api-mqtt.rfcx.org:8883|1673029589966*3635*469*ssl://staging-api-mqtt.rfcx.org:8883|1673029589966*3635*469*ssl://staging-api-mqtt.rfcx.org:8883|1673029589966*3635*469*ssl://staging-api-mqtt.rfcx.org:8883|1673029589966*3635*469*ssl://staging-api-mqtt.rfcx.org:8883|1673029589966*3635*469*ssl://staging-api-mqtt.rfcx.org:8883|1673029589966*3635*469*ssl://staging-api-mqtt.rfcx.org:8883|1673029589966*3635*469*ssl://staging-api-mqtt.rfcx.org:8883|1673029589966*3635*469*ssl://staging-api-mqtt.rfcx.org:8883|1673029589966*3635*469*ssl://staging-api-mqtt.rfcx.org:8883|1673029589966*3635*469*ssl://staging-api-mqtt.rfcx.org:8883')
    expect(meta.length).toBe(16)
    expect(meta[0].connectedAt).toBe('2023-01-06T18:24:47.813Z')
    expect(meta[0].connectionLatency).toBe(8278)
    expect(meta[0].subscriptionLatency).toBe(418)
    expect(meta[0].brokerUri).toBe('ssl://staging-api-mqtt.rfcx.org:8883')
    expect(meta[15].connectedAt).toBe('2023-01-06T18:26:29.966Z')
    expect(meta[15].connectionLatency).toBe(3635)
    expect(meta[15].subscriptionLatency).toBe(469)
    expect(meta[15].brokerUri).toBe('ssl://staging-api-mqtt.rfcx.org:8883')
  })
})

describe('parseCPUMeta function', () => {
  test('should return correct data', () => {
    const meta = parseCPUMeta('1420074209698*29*1001*162|1420070954264*91*1001*173|1420074078935*63*1001*186|1420072054705*18*1001*132|1420071909768*14*1001*120|1420071995390*24*1001*140|1420071850372*18*1001*121|1420072114088*16*1001*129|1420071795623*40*1001*198|1420071731366*16*1001*121|1420071791062*14*1001*120|1420072114088*16*1001*129|1420071716645*40*1001*198|1420071756134*34*1001*198|1420071672054*17*1001*122|1420072114088*16*1001*129|1420071676888*51*1001*197|1420072114088*16*1001*129|1420071597218*40*1001*199|1420071636845*35*1001*197|1420071553336*17*1001*124|1420071612734*13*1001*123|1420072114088*16*1001*129|1420071557421*41*1001*199|1420071494038*19*1001*127|1420072114088*16*1001*129|1420071478354*58*1001*200|1420071517885*36*1001*200')
    expect(meta.length).toBe(28)
    expect(meta[0].measuredAt).toBe('2015-01-01T01:03:29.698Z')
    expect(meta[0].cpuPercent).toBe(29)
    expect(meta[0].cpuClock).toBe(1001)
    expect(meta[27].measuredAt).toBe('2015-01-01T00:18:37.885Z')
    expect(meta[27].cpuPercent).toBe(36)
    expect(meta[27].cpuClock).toBe(1001)
  })
})

describe('parseCPUMemory function', () => {
  test('should return correct data', () => {
    const meta = parseMemoryMeta('system*1420071910078*304816128*176836608*57702400|system*1420072114301*306610176*175042560*57702400|system*1420071795843*307785728*173867008*57702400|system*1420071731838*304250880*177401856*57702400|system*1420072114301*306610176*175042560*57702400|system*1420072114301*306610176*175042560*57702400|system*1420071677160*306872320*174780416*57702400|system*1420072114301*306610176*175042560*57702400|system*1420071553532*303951872*177700864*57702400|system*1420072114301*306610176*175042560*57702400|system*1420071557726*304857088*176795648*57702400|system*1420072114301*306610176*175042560*57702400')
    expect(meta.length).toBe(12)
    expect(meta[0].measuredAt).toBe('2015-01-01T00:25:10.078Z')
    expect(meta[0].systemBytesUsed).toBe(304816128)
    expect(meta[0].systemBytesAvailable).toBe(176836608)
    expect(meta[0].systemBytesMinimum).toBe(57702400)
    expect(meta[11].measuredAt).toBe('2015-01-01T00:28:34.301Z')
    expect(meta[11].systemBytesUsed).toBe(306610176)
    expect(meta[11].systemBytesAvailable).toBe(175042560)
    expect(meta[11].systemBytesMinimum).toBe(57702400)
  })
})

describe('parseAssetExchangeLog function', () => {
  test('should return correct data for empty attributes', () => {
    const data = parseAssetExchangeLog({} as any)
    expect(Array.isArray(data.meta)).toBeTruthy()
    expect(data.meta.length).toBe(0)
    expect(Array.isArray(data.audio)).toBeTruthy()
    expect(data.audio.length).toBe(0)
    expect(Array.isArray(data.detections)).toBeTruthy()
    expect(data.detections.length).toBe(0)
    expect(Array.isArray(data.purged)).toBeTruthy()
    expect(data.purged.length).toBe(0)
  })
  test('should return correct data for filled attributes', () => {
    const data = parseAssetExchangeLog({
      meta_ids: ['1673029576205', '1420074241861', '1420074151825', '1420072089535', '1420071999331', '1420071909269', '1420071824021', '1420071819226', '1420071763963', '1420071729162', '1420071704228', '1420071643724', '1420071639124', '1420071583697', '1420071549037', '1420071523693'],
      checkins_to_verify: ['10', '20', '30'],
      detection_ids: ['1', '2', '10'],
      purged: 'meta*1673027709013|meta*1673027802023|meta*1673027892366|meta*1673027984323|meta*1673028074856|meta*1673028169993|meta*1673028260297|meta*1673028352933|meta*1673028443338|meta*1673028533429|meta*1673028623664|meta*1673028804065|meta*1673028904657|meta*1673028994953|meta*1673029175673|audio*1673029175340|audio*1673028713628|meta*1673028713899|meta*1673029085252|meta*1673029356114|audio*1673029265594'
    } as any)
    expect(data.meta.length).toBe(16)
    expect(data.meta[0].assetType).toBe('meta')
    expect(data.meta[0].assetId).toBe('1673029576205')
    expect(data.meta[15].assetType).toBe('meta')
    expect(data.meta[15].assetId).toBe('1420071523693')

    expect(data.audio.length).toBe(3)
    expect(data.audio[0].assetType).toBe('audio')
    expect(data.audio[0].assetId).toBe('10')
    expect(data.audio[2].assetType).toBe('audio')
    expect(data.audio[2].assetId).toBe('30')

    expect(data.detections.length).toBe(3)
    expect(data.detections[0].assetType).toBe('detections')
    expect(data.detections[0].assetId).toBe('1')
    expect(data.detections[2].assetType).toBe('detections')
    expect(data.detections[2].assetId).toBe('10')

    expect(data.purged.length).toBe(21)
    expect(data.purged[0].assetType).toBe('meta')
    expect(data.purged[0].assetId).toBe('1673027709013')
    expect(data.purged[20].assetType).toBe('audio')
    expect(data.purged[20].assetId).toBe('1673029265594')
  })
})

describe('parseSoftwareMeta function', () => {
  test('should return correct data', () => {
    const meta = parseSoftwareMeta('guardian*1.1.8|admin*1.1.7|classify*1.1.4|updater*1.0.0')
    expect(meta.guardian).toBe('1.1.8')
    expect(meta.admin).toBe('1.1.7')
    expect(meta.classify).toBe('1.1.4')
    expect(meta.updater).toBe('1.0.0')
  })
})

describe('parseRebootsMeta function', () => {
  test('should return correct data', () => {
    const meta = parseRebootsMeta('1673029468767*1673029468767|1673029574469*1673029574469|1420074150799*1420074150799')
    expect(meta.length).toBe(3)
    expect(meta[0].completedAt).toBe('2023-01-06T18:24:28.767Z')
    expect(meta[1].completedAt).toBe('2023-01-06T18:26:14.469Z')
    expect(meta[2].completedAt).toBe('2015-01-01T01:02:30.799Z')
  })
})

describe('parseBatteryMeta function', () => {
  test('should return correct data', () => {
    const meta = parseBatteryMeta('1420071909929*100*25*0*1|1420072114179*100*25*0*1|1420071795703*100*25*0*1|1420071731461*100*25*0*1|1420072114179*100*25*0*1|1420072114179*100*25*0*1|1420071677046*100*25*0*1|1420072114179*100*25*0*1|1420071553424*100*25*0*1|1420072114179*100*25*0*1|1420071557565*100*25*0*1|1420072114179*100*25*0*1')
    expect(meta.length).toBe(12)
    expect(meta[0].measuredAt).toBe('2015-01-01T00:25:09.929Z')
    expect(meta[0].batteryPercent).toBe(100)
    expect(meta[0].batteryTemperature).toBe(25)
    expect(meta[0].isCharging).toBe(false)
    expect(meta[11].measuredAt).toBe('2015-01-01T00:28:34.179Z')
    expect(meta[11].batteryPercent).toBe(100)
    expect(meta[11].batteryTemperature).toBe(25)
    expect(meta[11].isCharging).toBe(false)
  })
})

describe('parseDataTransferMeta function', () => {
  test('should return correct data', () => {
    const meta = parseDataTransferMeta('1420070892795*1420070954344*0*0*0*0*1959704*1959704*4868928*4869312|1420071995460*1420072054770*0*0*0*0*0*0*166477*166861|1420071850426*1420071909875*0*0*0*0*0*0*166477*166861|1420071791128*1420071850426*0*0*0*0*0*0*166477*166861|1420072054770*1420072114127*0*0*0*0*0*0*166477*166861|1420071756207*1420071795662*0*0*0*0*16864*116346*315468*2342214|1420071672100*1420071731416*0*0*0*0*0*0*166477*166861|1420071731416*1420071791128*0*0*0*0*0*0*166477*166861|1420072054770*1420072114127*0*0*0*0*0*0*166477*166861|1420071676961*1420071716696*0*0*0*0*11207*107397*277015*2119127|1420071716696*1420071756207*0*0*0*0*21589*106741*298604*2225868|1420071612779*1420071672100*0*0*0*0*0*0*166477*166861|1420072054770*1420072114127*0*0*0*0*0*0*166477*166861|1420071636915*1420071676961*0*0*0*0*15476*107308*265808*2011730|1420072054770*1420072114127*0*0*0*0*0*0*166477*166861|1420071557498*1420071597268*0*0*0*0*63749*149417*213873*1783976|1420071597268*1420071636915*0*0*0*0*36459*120446*250332*1904422|1420071494089*1420071553379*0*0*0*0*0*0*166477*166861|1420071553379*1420071612779*0*0*0*0*0*0*166477*166861|1420072054770*1420072114127*0*0*0*0*0*0*166477*166861|1420071517934*1420071557498*0*0*0*0*9829*105289*150124*1634559|1420071434610*1420071494089*0*0*0*0*0*0*166477*166861|1420072054770*1420072114127*0*0*0*0*0*0*166477*166861|1420071478426*1420071517934*0*0*0*0*8360*105220*140295*1529270')
    expect(meta.length).toBe(24)
    expect(meta[0].startedAt).toBe('2015-01-01T00:08:12.795Z')
    expect(meta[0].endedAt).toBe('2015-01-01T00:09:14.344Z')
    expect(meta[0].mobileBytesReceived).toBe(0)
    expect(meta[0].mobileBytesSent).toBe(0)
    expect(meta[0].mobileTotalBytesReceived).toBe(0)
    expect(meta[0].mobileTotalBytesSent).toBe(0)
    expect(meta[0].networkBytesReceived).toBe(1959704)
    expect(meta[0].networkBytesSent).toBe(1959704)
    expect(meta[0].networkTotalBytesReceived).toBe(4868928)
    expect(meta[0].networkTotalBytesSent).toBe(4869312)
    expect(meta[0].networkBytesReceived).toBe(1959704)
    expect(meta[0].networkBytesSent).toBe(1959704)
    expect(meta[0].networkTotalBytesReceived).toBe(4868928)
    expect(meta[0].networkTotalBytesSent).toBe(4869312)
  })
})

describe('parseStorageMeta function', () => {
  test('should return correct data', () => {
    const meta = parseStorageMeta('internal*1420071909975*180256768*1185153024|external*1420071909975*589824*127832588288|internal*1420072114227*177836032*1187573760|external*1420072114227*589824*127832588288|internal*1420071795750*179171328*1186238464|external*1420071795750*5734400*127827443712|internal*1420071731757*178925568*1186484224|external*1420071731757*589824*127832588288|internal*1420072114227*177836032*1187573760|external*1420072114227*589824*127832588288|internal*1420072114227*177836032*1187573760|external*1420072114227*589824*127832588288|internal*1420071677085*180461568*1184948224|external*1420071677085*5734400*127827443712|internal*1420072114227*177836032*1187573760|external*1420072114227*589824*127832588288|internal*1420071553469*176508928*1188900864|external*1420071553469*589824*127832588288|internal*1420072114227*177836032*1187573760|external*1420072114227*589824*127832588288|internal*1420071557639*178819072*1186590720|external*1420071557639*5734400*127827443712|internal*1420072114227*177836032*1187573760|external*1420072114227*589824*127832588288')
    expect(meta.length).toBe(7)
    expect(meta[0].measuredAt).toBe('2015-01-01T00:25:09.975Z')
    expect(meta[0].internalBytesAvailable).toBe(1185153024)
    expect(meta[0].internalBytesUsed).toBe(180256768)
    expect(meta[0].externalBytesAvailable).toBe(127832588288)
    expect(meta[0].externalBytesUsed).toBe(589824)
    expect(meta[6].measuredAt).toBe('2015-01-01T00:19:17.639Z')
    expect(meta[6].internalBytesAvailable).toBe(1186590720)
    expect(meta[6].internalBytesUsed).toBe(178819072)
    expect(meta[6].externalBytesAvailable).toBe(127827443712)
    expect(meta[6].externalBytesUsed).toBe(5734400)
  })
})
