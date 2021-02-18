import { Router } from 'express'
import moment from 'moment'
import dao from './dao'
import { DeploymentResponse, StreamResponse, ProjectResponse } from '../types'
import { jwtCheck } from '../common/auth'
import * as api from '../common/core-api'
import { getUserUid } from '../common/user'
import { mapStreamsAndDeployments } from './serializer'
import multer from 'multer'
import { uploadFileAndSaveToDb } from './service'

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

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
  const stream = deployment.stream
  const project = stream.project as ProjectResponse ?? null
  const uid = getUserUid(req.user.sub)
  let projectId = project?.id ?? null
  let streamId = stream?.id ?? null

  // TODO needs validation on all fields (especially deploymentKey)

  if (!moment(deployment.deployedAt, moment.ISO_8601).isValid()) {
    res.status(400).send('Invalid format: deployedAt')
    return
  }

  // TODO make this part of the service (keep route code minimal)
  try {
    // new stream
    if (streamId == null) {
      // new project
      if (project != null && projectId == null) {
        projectId = await api.createProject(req.headers.authorization, project)
        project.id = projectId

        streamId = await api.createStream(req.headers.authorization, stream, projectId)
        stream.id = streamId
        // exist project
      } else {
        streamId = await api.createStream(req.headers.authorization, stream, projectId)
        stream.id = streamId
      }
    }
    deployment.stream = stream
    deployment.stream.project = project
    const data = await dao.createDeployment(uid, deployment)
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

router.post('/:id/assets', jwtCheck, upload.single('file'), async (req: any, res: any) => {
  const uid = getUserUid(req.user.sub)
  const deploymentId = req.params.id
  const imageBase64 = req.body.image ?? null
  const file = req.file ?? null
  try {
    const streamId = await dao.getStreamIdById(uid, deploymentId)
    await uploadFileAndSaveToDb(streamId, deploymentId, imageBase64, file)
    res.send('Upload Asset Success')
  } catch (error) {
    console.log(error)
    res.status(400).send(error.message ?? error)
  }
})

export default router
