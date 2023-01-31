import { muteConsole } from '../../../common/db/testing'
import { expandAbbreviatedFieldNames } from './expand-abbr'

const json = {
  dt: 'dt1',
  c: 'c1',
  btt: 'btt1',
  nw: 'nw1',
  str: 'str1',
  mm: 'mm1',
  bc: 'bc1',
  dtt: 'dtt1',
  sw: 'sw1',
  chn: 'chn1',
  sp: 'sp1',
  dv: {
    a: { p: 'p1', br: 'br1', m: 'm1', bu: 'bu1', a: 'a1', mf: 'mf1' },
    p: { s: 's1', n: 'n1', imei: 'imei1', imsi: 'imsi1' }
  },
  ma: 'ma1',
  msg: 'msg1',
  mid: 'mid1',
  did: 'did1',
  p: 'p1',
  pf: { s: '123', v: '456', d: '789' },
  foo: 'bar'
}

beforeAll(() => {
  muteConsole(['info'])
})

describe('expandAbbreviatedFieldNames function', () => {
  test('should return correct data', () => {
    const meta = expandAbbreviatedFieldNames(json)
    expect(meta.data_transfer).toBe('dt1')
    expect(meta.cpu).toBe('c1')
    expect(meta.battery).toBe('btt1')
    expect(meta.network).toBe('nw1')
    expect(meta.storage).toBe('str1')
    expect(meta.memory).toBe('mm1')
    expect(meta.broker_connections).toBe('bc1')
    expect(meta.detections).toBe('dtt1')
    expect(meta.software).toBe('sw1')
    expect(meta.checkins).toBe('chn1')
    expect(meta.sentinel_power).toBe('sp1')
    const android = meta.device.android
    expect(android.product).toBe('p1')
    expect(android.brand).toBe('br1')
    expect(android.model).toBe('m1')
    expect(android.build).toBe('bu1')
    expect(android.android).toBe('a1')
    expect(android.manufacturer).toBe('mf1')
    const phone = meta.device.phone
    expect(phone.sim).toBe('s1')
    expect(phone.number).toBe('n1')
    expect(phone.imei).toBe('imei1')
    expect(phone.imsi).toBe('imsi1')
    expect(meta.measured_at).toBe('ma1')
    expect(meta.messages).toBe('msg1')
    expect(meta.meta_ids).toBe('mid1')
    expect(meta.detection_ids).toBe('did1')
    expect(meta.purged).toBe('p1')
    expect(meta.prefs.sha1).toBe('123')
    expect(meta.prefs.vals).toBe('456')
    expect(meta.prefs.d).toBe('789')
    expect(meta.foo).toBe('bar')
  })
  test('should return correct data fpr empty object', () => {
    const meta = expandAbbreviatedFieldNames({})
    expect(meta.data_transfer).toBeUndefined()
    expect(meta.cpu).toBeUndefined()
    expect(meta.battery).toBeUndefined()
    expect(meta.network).toBeUndefined()
    expect(meta.storage).toBeUndefined()
    expect(meta.memory).toBeUndefined()
    expect(meta.broker_connections).toBeUndefined()
    expect(meta.detections).toBeUndefined()
    expect(meta.software).toBeUndefined()
    expect(meta.checkins).toBeUndefined()
    expect(meta.sentinel_power).toBeUndefined()
    expect(meta.device.android).toBeUndefined()
    expect(meta.device.phone).toBeUndefined()
    expect(meta.measured_at).toBeUndefined()
    expect(meta.messages).toBeUndefined()
    expect(meta.meta_ids).toBeUndefined()
    expect(meta.detection_ids).toBeUndefined()
    expect(meta.purged).toBeUndefined()
    expect(meta.prefs).toBeUndefined()
  })
})
