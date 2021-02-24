import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import dayjs from 'dayjs'
import dao from './dao'
import { DeploymentResponse, StreamResponse, ProjectResponse } from '../types'
import { multerFile } from '../common/multer'
import * as api from '../common/core-api'
import { getUserUid } from '../common/user'
import { mapStreamsAndDeployments } from './serializer'
import service from './service'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const uid = getUserUid(req.user.sub)
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
  const token = req.headers.authorization ?? ''

  try {
    const streams = await api.getStreams(token)
    const deployments = await dao.getDeployments(uid, options)
    const deploymentsForCompanion = await mapStreamsAndDeployments(streams.data, deployments)
    res.send(deploymentsForCompanion)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req: any, res: any) => {
  const deployment = req.body as DeploymentResponse
  const uid = getUserUid(req.user.sub)

  // TODO needs validation on all fields (especially deploymentKey)

  if (!dayjs(deployment.deployedAt).isValid()) {
    res.status(400).send('Invalid format: deployedAt')
    return
  }

  try {
    const data = await service.createDeployment(uid, req.headers.authorization, deployment)
    res.location(`/deployments/${data.id}`).sendStatus(201)
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

router.patch('/:id', async (req: any, res: any) => {
  const uid = getUserUid(req.user.sub)
  const stream = req.body.stream as StreamResponse ?? null
  const project = req.body.project as ProjectResponse ?? null
  try {
    if (project != null) {
      await api.updateProject(req.headers.authorization, project)
    }

    if (stream != null) {
      await api.updateStream(req.headers.authorization, stream)
    }

    await dao.updateDeployment(uid, req.params.id)
    res.send('Success')
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

router.delete('/:id', async (req: any, res: any) => {
  const uid = getUserUid(req.user.sub)
  try {
    await dao.deleteDeployment(uid, req.params.id)
    res.send('Success')
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

router.post('/:id/assets', multerFile.single('file'), async (req: any, res: any) => {
  const uid = getUserUid(req.user.sub)
  const deploymentId = req.params.id
  const file = req.file ?? null
  try {
    const streamId = await dao.getStreamIdById(uid, deploymentId)
    await service.uploadFileAndSaveToDb(streamId, deploymentId, file)
    res.send('Upload Asset Success')
  } catch (error) {
    console.log(error)
    res.status(400).send(error.message ?? error)
  }
})

export default router
