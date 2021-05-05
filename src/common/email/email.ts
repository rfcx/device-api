/* eslint-disable @typescript-eslint/member-delimiter-style */
export interface EmailMessage {
  text: string
  subject: string
  html?: string | null
  from_email: string
  from_name: string
  to: Receiver[]
  auto_html: boolean
}

export interface Receiver {
  email: string
  name: string
  type: string
}
