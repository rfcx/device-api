import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import dayjs from 'dayjs'
import dao from './dao'
import assetDao from '../assets/dao'
import configurationDao from '../configurations/dao'
import { DeploymentResponse, UpdateConfigurationRequest, UpdateStreamRequest } from '../types'
import { multerFile } from '../common/multer'
import * as api from '../common/core-api'
import { getUserUid } from '../common/user'
import { mapStreamsAndDeployments } from './serializer'
import service from './service'
import Deployment from './deployment.model'
import { ValidationError } from 'sequelize'

const router = Router()

router.get('/', (req: Request, res: Response, next: NextFunction): void => {
  const userId = getUserUid(req.user.sub)
  const userToken = req.headers.authorization ?? ''
  const options: { isActive?: boolean, limit?: number, offset?: number } = {}
  if (req.query.active === 'true' || req.query.active === 'false') {
    options.isActive = req.query.active === 'true'
  }
  if (typeof req.query.limit === 'string') {
    options.limit = parseInt(req.query.limit)
  }
  if (typeof req.query.offset === 'string') {
    options.offset = parseInt(req.query.offset)
  }

  api.getStreams(userToken, { limit: 2000 }).then(async streams => {
    const deployments = await dao.getDeployments(userId, options)
    const deploymentsForCompanion = mapStreamsAndDeployments(streams, deployments)
    res.send(deploymentsForCompanion)
  }).catch(next)
})

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
  const deployment = req.body as DeploymentResponse
  const userId = getUserUid(req.user.sub)
  const userToken = req.headers.authorization ?? ''

  // TODO needs validation on all fields (especially deploymentKey)

  if (!dayjs(deployment.deployedAt).isValid()) {
    res.status(400).send('Invalid format: deployedAt')
    return
  }

  service.createDeployment(userId, userToken, deployment).then(data => {
    res.location(`/deployments/${data.id}`).sendStatus(201)
  }).catch(error => {
    if (error instanceof ValidationError) {
      res.status(400).send(error.errors.length > 0 ? error.errors.map(e => e.message).join(', ') : error.message)
    } else {
      next(error)
    }
  })
})

router.get('/:id', (req: Request, res: Response, next: NextFunction): void => {
  const userToken = req.headers.authorization ?? ''
  dao.get(req.params.id).then(async deployment => {
    if (deployment === null) {
      res.status(404).send('Not found')
    } else {
      const { streamId, ...partialDeployment } = deployment.toJSON() as Deployment
      const stream = await api.getStream(userToken, deployment.streamId)
      const result = { ...partialDeployment, stream }
      res.json(result)
    }
  }).catch(next)
})

router.patch('/:id', (req: Request, res: Response, next: NextFunction): void => {
  const userId = getUserUid(req.user.sub)
  const userToken = req.headers.authorization ?? ''
  const stream: UpdateStreamRequest | undefined | null = req.body.stream
  const config: UpdateConfigurationRequest | undefined | null = req.body.configuration

  dao.updateDeployment(userId, req.params.id).then(async () => {
    if (stream !== undefined && stream !== null) {
      await api.updateStream(userToken, stream)
    }
    if (config !== undefined && config !== null) {
      const configId = await dao.getConfigurationIdById(userId, req.params.id)
      if (configId !== undefined) {
        config.id = configId
        await configurationDao.update(userToken, config)
      }
    }
    res.send('Success')
  }).catch(next)
})

router.delete('/:id', (req: Request, res: Response, next: NextFunction): void => {
  const userId = getUserUid(req.user.sub)
  dao.deleteDeployment(userId, req.params.id).then(() => {
    res.send('Success')
  }).catch(next)
})

router.get('/:id/assets', (req: Request, res: Response, next: NextFunction): void => {
  const deploymentId = req.params.id
  assetDao.query({ deploymentId }).then(results => {
    res.json(results)
  }).catch(next)
})

router.post('/:id/assets', multerFile.single('file'), (req: Request, res: Response, next: NextFunction): void => {
  const userId = getUserUid(req.user.sub)
  const deploymentId = req.params.id
  const file = req.file ?? null
  dao.getStreamIdById(userId, deploymentId).then(async streamId => {
    const assetId = await service.uploadFileAndSaveToDb(streamId, deploymentId, file)
    res.location(`/assets/${assetId}`).sendStatus(201)
  }).catch(next)
})

export default router
