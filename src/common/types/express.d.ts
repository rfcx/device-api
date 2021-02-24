interface UserPayload {
  sub: string
}

declare namespace Express {
  export interface Request {
    user: UserPayload
  }
}
