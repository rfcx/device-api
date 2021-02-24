import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import * as api from '../common/core-api'

const router = Router()

router.get('/', async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const streams = await api.getStreams(req.headers.authorization)
    res.send(streams.data)
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

export default router
