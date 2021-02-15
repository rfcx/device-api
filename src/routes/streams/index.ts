import express from 'express'
import { api, authUtils } from '../../utils'

const router = express.Router()

router.get('/', authUtils.jwtCheck, async (req: any, res: any) => {
  try {
    const streams = await api.getStreamsFromCore(req.headers.authorization)
    res.send(streams.data)
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

module.exports = router
