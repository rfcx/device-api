import { GuardianDeviceMetaAbbr, GuardianDeviceMeta } from '../../types'

export const expandAbbreviatedFieldNames = function (json: any): any {
  const { dt, c, btt, nw, str, mm, bc, dtt, sw, chn, sp, dv, ma, msg, mid, did, p, pf, ...others } = json
  return {
    data_transfer: dt,
    cpu: c,
    battery: btt,
    network: nw,
    storage: str,
    memory: mm,
    broker_connections: bc,
    detections: dtt,
    software: sw,
    checkins: chn,
    sentinel_power: sp,
    device: expandAbbreviatedDevice(dv),
    measured_at: ma,
    messages: msg,
    meta_ids: mid,
    detection_ids: did,
    purged: p,
    prefs: expandAbbreviatedPrefs(pf),
    ...others
  }
}

function expandAbbreviatedPrefs (prefsObj: any): any {
  if (prefsObj === undefined || prefsObj === null) {
    return prefsObj
  }
  const { s, v, ...others } = prefsObj
  return {
    sha1: s ?? null,
    vals: v ?? null,
    ...others
  }
}

function expandAbbreviatedDevice (deviceObj: GuardianDeviceMetaAbbr): GuardianDeviceMeta {
  if (deviceObj === undefined) {
    return { android: undefined, phone: undefined }
  }
  const { a, p } = deviceObj
  return {
    android: a !== undefined
      ? {
          product: a.p,
          brand: a.br,
          model: a.m,
          build: a.bu,
          android: a.a,
          manufacturer: a.mf
        }
      : undefined,
    phone: p !== undefined
      ? {
          sim: p.s,
          number: p.n,
          imei: p.imei,
          imsi: p.imsi
        }
      : undefined
  }
}

export default { expandAbbreviatedFieldNames }
