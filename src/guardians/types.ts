export interface GuardianUpdatable {
  shortname?: string
  phoneNumber?: string
  latitude?: number
  longitude?: number
  altitude?: number
  lastCheckIn?: Date
  checkInCount?: number
  lastPing?: Date
  lastAudioSync?: Date
  lastBatteryMain?: Date
  lastBatteryInternal?: Date
}
