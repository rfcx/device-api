import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { RegisterGuardianRequest } from '../types'
import * as api from '../common/core-api'

const router = Router()

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
  const userToken = req.headers.authorization ?? ''
  const body = req.body as RegisterGuardianRequest
  api.registerGuardian(userToken, body.guid).then(data => {
    res.send(data)
  }).catch(next)
})

export default router
