import { Router } from 'express'
import dayjs from 'dayjs'
import dao from './dao'
import { DeploymentResponse, StreamResponse, ProjectResponse } from '../types'
import { jwtCheck } from '../common/auth'
import { multerFile } from '../common/multer'
import * as api from '../common/core-api'
import { getUserUid } from '../common/user'
import { mapStreamsAndDeployments } from './serializer'
import service from './service'

const router = Router()

router.get('/', jwtCheck, async (req: any, res: any) => {
  const uid = getUserUid(req.user.sub)
  const option = {
    isActive: req.query.is_active ?? true,
    limit: req.query.limit ?? 100,
    offset: req.query.offset ?? 0
  }
  try {
    const streams = await api.getStreams(req.headers.authorization)
    const deployments = await dao.getDeployments(uid, option)
    const deploymentsForCompanion = await mapStreamsAndDeployments(streams.data, deployments)
    res.send(deploymentsForCompanion)
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

router.post('/', jwtCheck, async (req: any, res: any) => {
  const deployment = req.body as DeploymentResponse
  const uid = getUserUid(req.user.sub)

  // TODO needs validation on all fields (especially deploymentKey)

  if (!dayjs(deployment.deployedAt, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').isValid()) {
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

router.patch('/:id', jwtCheck, async (req: any, res: any) => {
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

router.delete('/:id', jwtCheck, async (req: any, res: any) => {
  const uid = getUserUid(req.user.sub)
  try {
    await dao.deleteDeployment(uid, req.params.id)
    res.send('Success')
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

router.post('/:id/assets', jwtCheck, multerFile.single('file'), async (req: any, res: any) => {
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
