interface ResponseInError {
  data: RequestData
}

interface RequestData {
  message: string
  error: any
}

export interface ErrorWithResponse extends Error {
  response: ResponseInError
}
