interface ResponseInError {
  data: RequestData
}

interface RequestData {
  message: string
  error: any
}

export interface ErrorWithRequest extends Error {
  response: ResponseInError
}
