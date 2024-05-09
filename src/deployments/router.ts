import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import dayjs from 'dayjs'
import dao from './dao'
import assetDao from '../assets/dao'
import { DeploymentRequest, Stream, User, DeploymentQuery } from '../types'
import { multerFile } from '../common/multer'
import * as api from '../common/core-api'
import { getUserUid } from '../common/user'
import service from './service'
import { userAgentToAppInfo } from '../common/headers'
import { Converter, httpErrorHandler } from '@rfcx/http-utils'

const router = Router()

router.post('/', (req: Request, res: Response): void => {
  const deployment = req.body as DeploymentRequest
  const user: User = { name: req.user.name, email: req.user.email }
  const userId = getUserUid(req.user.sub)
  const userToken = req.headers.authorization ?? ''
  const appVersion = userAgentToAppInfo(req.headers['user-agent'])?.versionCode

  // TODO needs validation on all fields (especially deploymentKey)

  if (deployment.deploymentKey == null) {
    console.info('deploymentKey should not be null')
    res.status(400).send('deploymentKey should not be null')
    return
  }

  if (!dayjs(deployment.deployedAt).isValid()) {
    console.info('Invalid format: deployedAt')
    res.status(400).send('Invalid format: deployedAt')
    return
  }

  service.createDeployment(appVersion, userId, userToken, user, deployment).then(data => {
    res.location(`/deployments/${data.id}`).sendStatus(201)
  }).catch(httpErrorHandler(req, res, 'Failed creating a deployment'))
})

router.get('/:id', (req: Request, res: Response): void => {
  const userToken = req.headers.authorization ?? ''
  dao.get(req.params.id).then(async deployment => {
    if (deployment === null) {
      res.status(404).send('Not found')
    } else {
      const { streamId, ...partialDeployment } = deployment.toJSON()
      const stream = await api.getStream(userToken, deployment.streamId)
      const result = { ...partialDeployment, stream }
      res.json(result)
    }
  }).catch(httpErrorHandler(req, res, 'Failed getting a deployment'))
})

router.get('/', (req: Request, res: Response, next: NextFunction): void => {
  const converter = new Converter(req.query, {}, { camelize: true })
  converter.convert('streamIds').optional().toArray()
  converter.convert('projectIds').optional().toArray()
  converter.convert('isActive').optional().toBoolean()
  converter.convert('limit').default(100).toInt()
  converter.convert('offset').default(0).toInt()
  converter.convert('type').optional().toString()
  converter.validate()
    .then(async (query: DeploymentQuery) => {
      if (query.streamIds != null && query.projectIds != null) {
        res.status(400).send('Only allow either streamIds and projectId in the same query')
        return
      }
      if (query.projectIds != null) {
        const userToken = req.headers.authorization ?? ''
        const streams = await api.getStreams(userToken, { projects: query.projectIds })
        query.streamIds = streams.map(stream => stream.id)
      }

      dao.getDeployments(query.streamIds, query).then(async deployments => {
        res.json(deployments)
      }).catch(error => {
        next(error)
      })
    })
    .catch(httpErrorHandler(req, res, 'Failed getting deployments.'))
})

router.patch('/:id', (req: Request, res: Response): void => {
  const userId = getUserUid(req.user.sub)
  const userToken = req.headers.authorization ?? ''
  const stream: Stream | undefined | null = req.body.stream

  dao.updateDeployment(userId, req.params.id).then(async () => {
    if (stream !== undefined && stream !== null) {
      await api.updateStream(userToken, stream)
    }
    res.send('Success')
  }).catch(httpErrorHandler(req, res, 'Failed updating a deployment'))
})

router.delete('/:id', (req: Request, res: Response): void => {
  const userId = getUserUid(req.user.sub)
  dao.deleteDeployment(userId, req.params.id).then(() => {
    res.send('Success')
  }).catch(httpErrorHandler(req, res, 'Failed deleting a deployment'))
})

router.get('/:id/assets', (req: Request, res: Response): void => {
  const deploymentId = req.params.id
  assetDao.query({ deploymentId }).then(results => {
    res.json(results)
  }).catch(httpErrorHandler(req, res, 'Failed getting assets'))
})

router.post('/:id/assets', multerFile.single('file'), (req: Request, res: Response): void => {
  const deploymentId = req.params.id
  const file = req.file ?? null
  const parameter = req.body.meta
  dao.getStreamIdById(deploymentId).then(async streamId => {
    const assetId = await service.uploadFileAndSaveToDb(streamId, deploymentId, file, parameter)
    res.location(`/assets/${assetId}`).sendStatus(201)
  }).catch(httpErrorHandler(req, res, 'Failed uploading assets'))
})

export default router
