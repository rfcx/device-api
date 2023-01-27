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
    device: dv,
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
  return { sha1: s, vals: v, ...others }
}

export default { expandAbbreviatedFieldNames }
