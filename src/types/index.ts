export interface DeploymentResponse {
  isActive: boolean
  deploymentKey: string
  deployedAt: Date
  deploymentType: string
  stream: StreamResponse
  deviceParameters: any
}

export interface DeploymentQuery {
  isActive?: boolean
  limit?: number
  offset?: number
}

export type MappedDeploymentInfo = StreamResponse & { deployment?: DeploymentResponse }

export interface DeploymentRequest {
  isActive: boolean
  deploymentKey: string
  deployedAt: Date
  deploymentType: string
  stream: Stream
  deviceParameters?: any
}

export interface StreamResponse {
  id: string
  name: string
  latitude: number
  longitude: number
  altitude: number
  project: ProjectResponse | null
}

export interface Stream {
  id?: string
  name?: string
  latitude?: number
  longitude?: number
  altitude?: number
  project?: Project
}

export interface Project {
  id?: string
  name?: string
}

export interface ProjectResponse {
  id: string
  name: string
}

export interface NewAsset {
  fileName: string
  mimeType: string
  deploymentId: string
  streamId: string
}

export interface User {
  name: string
  email: string
}

export interface UpdateGuardian {
  latitude?: number
  longitude?: number
  altitude?: number
  stream_id?: string
  project_id?: string
  shortname?: string
  is_deployed?: boolean
}

export interface UpdateGuardianResponse {
  guid: string
  shortname: string
  latitude: number
  longitude: number
  altitude: number
  streamId: string
  projectId: string
}

export interface ProjectByIdResponse {
  id: string
  name: string
  minLatitude: number | null
  maxLatitude: number | null
  minLongitude: number | null
  maxLongitude: number | null
}

export interface ProjectOffTimes {
  id: string
  offTimes: string
}

export interface RegisterGuardianRequest {
  guid: string
  token: String
  pinCode: String
}

export interface RegisterGuardianResponse {
  guid: string
  token: string
  keystorePassPhase: string
  pinCode: string | null
  apiMqttHost: string | null
  apiSmsAddress: string | null
}

export interface UserTouchResponse {
  success: boolean
}

export interface AppInfo {
  name: string
  versionName: string
  versionCode: number
}

export * from '../guardian-checkin/types'
export * from '../guardian-checkin/utils/message/types'
export * from '../guardians/types'
export * from '../common/mqtt/types'
