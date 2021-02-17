export interface DeploymentResponse {
  isActive: boolean
  deploymentKey: string
  deployedAt: Date
  deploymentType: string
  stream: StreamResponse
}

export interface StreamResponse {
  id?: string | null
  name: string
  latitude: number
  longitude: number
  altitude: number
  project?: ProjectResponse | null
}

export interface ProjectResponse {
  id?: string | null
  name: string
  color: String
}
