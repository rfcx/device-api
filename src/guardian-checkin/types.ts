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

export interface CheckinPayload {
  guardianId: string
  checkin: GuardianCheckinCreatable
}
