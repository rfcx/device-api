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

export interface CreateDeploymentRequest {
  isActive: boolean
  deploymentKey: string
  deployedAt: Date
  deploymentType: string
  stream: { id: string } | CreateStreamRequest | UpdateStreamRequest
  deviceParameters?: any
}

export type NewDeployment = CreateDeploymentRequest & { stream: { id: string } }

export interface StreamResponse {
  id: string
  name: string
  latitude: number
  longitude: number
  altitude: number
  project: ProjectResponse | null
}

export interface CreateStreamRequest {
  name: string
  latitude: number
  longitude: number
  altitude: number
  project?: { id: string } | CreateProjectRequest
}

export interface UpdateStreamRequest {
  id: string
  name?: string
  latitude?: number
  longitude?: number
  altitude?: number
  project?: { id: string }
}

export interface ProjectResponse {
  id: string
  name: string
}

export interface CreateProjectRequest {
  name: string
}

export interface UpdateProjectRequest {
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
}

export interface UpdateGuardianResponse {
  guid: string
  shortname: string
  latitude: number
  longitude: number
  altitude: number
  streamId: string
}

export interface ProjectByIdResponse {
  id: string
  name: string
  minLatitude: number | null
  maxLatitude: number | null
  minLongitude: number | null
  maxLongitude: number | null
}

export interface RegisterGuardianRequest {
  guid: string
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
