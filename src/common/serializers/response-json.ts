import type { Response } from 'express'
import { camelToSnake } from './snake-camel'

export default function (this: Response, objectOrArray: any): void {
  const accepts = this.req?.header('Accept')
  if (accepts === 'application/json;format=snake') {
    objectOrArray = camelToSnake(objectOrArray)
  }
  this.set('Content-Type', 'application/json')
  this.status(200).send(JSON.stringify(objectOrArray))
}
