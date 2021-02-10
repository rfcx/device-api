/* eslint-disable @typescript-eslint/member-delimiter-style */
export interface Deployment {
  isActive: boolean
  deploymentKey: string
  createdAt: Date
  deletedAt?: Date
  deployedAt: Date
  device: string
  stream: Stream
  updatedAt: Date
}

export interface Stream {
  coreId?: string | null
  name: string
  latitude: number
  longitude: number
  altitude: number
  project?: Project
}

export interface Project {
  coreId?: string | null
  name: string
  color: String
}
