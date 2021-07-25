export interface DeploymentResponse {
  isActive: boolean
  deploymentKey: string
  deployedAt: Date
  deploymentType: string
  stream: StreamResponse
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
