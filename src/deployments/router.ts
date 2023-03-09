import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import dayjs from 'dayjs'
import dao from './dao'
import assetDao from '../assets/dao'
import { DeploymentRequest, Stream, User } from '../types'
import { multerFile } from '../common/multer'
import * as api from '../common/core-api'
import { getUserUid } from '../common/user'
import service from './service'
import Deployment from './deployment.model'
import { ValidationError } from 'sequelize'
import { userAgentToAppInfo } from '../common/headers'

const router = Router()

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
  const deployment = req.body as DeploymentRequest
  const user: User = { name: req.user.name, email: req.user.email }
  const userId = getUserUid(req.user.sub)
  const userToken = req.headers.authorization ?? ''
  const appVersion = userAgentToAppInfo(req.headers['user-agent'])?.versionCode

  // TODO needs validation on all fields (especially deploymentKey)

  if (deployment.deploymentKey == null) {
    console.error('deploymentKey should not be null')
    res.status(400).send('deploymentKey should not be null')
    return
  }

  if (!dayjs(deployment.deployedAt).isValid()) {
    console.error('Invalid format: deployedAt')
    res.status(400).send('Invalid format: deployedAt')
    return
  }

  service.createDeployment(appVersion, userId, userToken, user, deployment).then(data => {
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
  }).catch(error => {
    if (error.response !== undefined && error.response.status >= 400 && error.response.status <= 499) {
      res.status(error.response.status).send(error.response.statusText)
    } else {
      next(error)
    }
  })
})

router.patch('/:id', (req: Request, res: Response, next: NextFunction): void => {
  const userId = getUserUid(req.user.sub)
  const userToken = req.headers.authorization ?? ''
  const stream: Stream | undefined | null = req.body.stream

  dao.updateDeployment(userId, req.params.id).then(async () => {
    if (stream !== undefined && stream !== null) {
      await api.updateStream(userToken, stream)
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
  const deploymentId = req.params.id
  const file = req.file ?? null
  const parameter = req.body.assetParams

  dao.getStreamIdById(deploymentId).then(async streamId => {
    const assetId = await service.uploadFileAndSaveToDb(streamId, deploymentId, file, parameter)
    res.location(`/assets/${assetId}`).sendStatus(201)
  }).catch(next)
})

export default router
