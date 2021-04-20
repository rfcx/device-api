interface UserPayload {
  sub: string
  name: string
  email: string
}

declare namespace Express {
  export interface Request {
    user: UserPayload
  }
}
