import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import * as api from '../common/core-api'
import { httpErrorHandler } from '@rfcx/http-utils'

const router = Router()

router.get('/', (req: Request, res: Response, next: NextFunction): void => {
  const userToken = req.headers.authorization ?? ''
  api.userTouch(userToken).then(data => {
    res.send(data)
  }).catch(httpErrorHandler(req, res, 'Failed getting usertouch.'))
})

export default router
