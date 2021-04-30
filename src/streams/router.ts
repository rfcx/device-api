import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import * as api from '../common/core-api'
import assetDao from '../assets/dao'
import deploymentDao from '../deployments/dao'
import { mapStreamsAndDeployments } from './serializer'

const router = Router()

router.get('/', (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization ?? ''
  api.getStreams(token, req.query).then(streams => {
    res.send(streams)
  }).catch(next)
})

router.get('/deployments', (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization ?? ''
  api.getStreams(token, req.query).then( async (streams) => {
    const deployments = await deploymentDao.getDeployments(streams.map(stream => stream.id))
    const deploymentsInfo = mapStreamsAndDeployments(streams, deployments)
    res.send(deploymentsInfo)
  }).catch(next)
})

router.get('/:id/assets', (req: Request, res: Response, next: NextFunction): void => {
  const streamId = req.params.id
  assetDao.query({ streamId }).then(results => {
    res.json(results)
  }).catch(next)
})

export default router
