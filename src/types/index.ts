export interface DeploymentResponse {
  isActive: boolean
  deploymentKey: string
  deployedAt: Date
  deploymentType: string
  stream: StreamResponse
  configuration?: ConfigurationResponse
}

export interface CreateDeploymentRequest {
  isActive: boolean
  deploymentKey: string
  deployedAt: Date
  deploymentType: string
  stream: { id: string } | CreateStreamRequest | UpdateStreamRequest
  configuration?: CreateConfigurationRequest
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

export interface ConfigurationResponse {
  bitrate: number
  sampleRate: number
  duration: number
  fileFormat: string
}

export type NewConfiguration = ConfigurationResponse
export type CreateConfigurationRequest = ConfigurationResponse
