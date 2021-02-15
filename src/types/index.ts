/* eslint-disable @typescript-eslint/member-delimiter-style */
export interface Deployment {
  isActive: boolean
  deploymentKey: string
  deployedAt: Date
  deploymentType: string
  stream: Stream
}

export interface Stream {
  id?: string | null
  name: string
  latitude: number
  longitude: number
  altitude: number
  project?: Project | null
}

export interface Project {
  id?: string | null
  name: string
  color: String
}
