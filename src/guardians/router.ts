import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { RegisterGuardianRequest } from '../types'
import * as api from '../common/core-api'
import { httpErrorHandler } from '@rfcx/http-utils'

const router = Router()

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
  const userToken = req.headers.authorization ?? ''
  const body = req.body as RegisterGuardianRequest
  api.registerGuardian(userToken, body).then(data => {
    res.send(data)
  }).catch(httpErrorHandler(req, res, 'Failed registering guardian.'))
})

export default router
