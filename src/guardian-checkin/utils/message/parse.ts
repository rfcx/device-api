import { GuardianMessageObject, MqttMessageJson } from '../../../types'

export const constructGuardianMsgObj = function (inputJson: MqttMessageJson, guardianGuid: string, guardianToken: string): GuardianMessageObject {
  const msgObj = {

    // input msg json
    json: inputJson,

    // db objects
    // db: {},

    // general msg meta
    meta: {
      guardian: {},
      allow_without_auth_token: false,
      startTime: new Date()
    },

    // asset meta
    audio: {},
    screenshots: {},
    logs: {},
    // photos: {},
    // videos: {},

    // return cmd obj
    rtrn: {
      obj: {
        checkin_id: null,
        // asset types
        audio: [],
        meta: [],
        screenshots: [],
        logs: [],
        photos: [],
        videos: [],
        messages: [],
        apks: [],
        detections: [],
        classifiers: [],
        instructions: [],
        prefs: [],
        segments: [],
        snippets: [],
        // asset exchange status
        purged: [],
        received: [],
        unconfirmed: []
      }
    },

    // alternative (shorter) field names
    abbr: {
      fields: {
        // asset types
        audio: 'aud',
        meta: 'mta',
        screenshots: 'scn',
        logs: 'log',
        photos: 'pho',
        videos: 'vid',
        messages: 'sms',
        apks: 'apk',
        detections: 'det',
        classifiers: 'cls',
        instructions: 'ins',
        prefs: 'prf',
        segments: 'seg',
        snippets: 'sni',
        // asset exchange status
        purged: 'prg',
        received: 'rec',
        unconfirmed: 'unc'
      }
    }
  }

  if (inputJson.guardian === undefined) {
    msgObj.json.guardian = {}
  }
  if (msgObj.json.guardian !== undefined) {
    if (guardianGuid !== undefined) { msgObj.json.guardian.guid = guardianGuid }
    if (guardianToken !== undefined) { msgObj.json.guardian.token = guardianToken }
  }

  return msgObj
}
