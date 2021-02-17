import { Router } from 'express'
import { jwtCheck } from '../common/auth'
import * as api from '../common/core-api'

const router = Router()

router.get('/', jwtCheck, async (req: any, res: any) => {
  try {
    const streams = await api.getStreams(req.headers.authorization)
    res.send(streams.data)
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

export default router
