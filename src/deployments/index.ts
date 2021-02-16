import express from 'express'
import moment from 'moment'
import * as service from './service'
import { Deployment, Stream, Project } from '../types'
import { api, authUtils, userUtils, deploymentUtils } from '../utils'

const router = express.Router()

router.get('/', authUtils.jwtCheck, async (req: any, res: any) => {
  const uid = userUtils.getUserUid(req.user.sub)
  const option = {
    isActive: req.query.is_active ?? true,
    limit: req.query.limit ?? 100,
    offset: req.query.offset ?? 0
  }
  try {
    const streams = await api.getStreamsFromCore(req.headers.authorization)
    const deployments = await service.getDeployments(uid, option)
    const deploymentsForCompanion = await deploymentUtils.mapStreamsAndDeployments(streams.data, deployments)
    res.send(deploymentsForCompanion)
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

router.post('/', authUtils.jwtCheck, async (req: any, res: any) => {
  const deployment = req.body as Deployment
  const stream = deployment.stream
  const project = stream.project as Project ?? null
  const uid = userUtils.getUserUid(req.user.sub)
  let projectId = project?.id ?? null
  let streamId = stream?.id ?? null

  if (!moment(deployment.deployedAt, moment.ISO_8601).isValid()) {
    res.status(400).send('Invalid format: deployedAt')
    return
  }

  try {
    // new stream
    if (streamId == null) {
      // new project
      if (project != null && projectId == null) {
        projectId = await api.createProjectToCore(req.headers.authorization, project)
        project.id = projectId

        streamId = await api.createStreamToCore(req.headers.authorization, stream, projectId)
        stream.id = streamId
        // exist project
      } else {
        streamId = await api.createStreamToCore(req.headers.authorization, stream, projectId)
        stream.id = streamId
      }
    }
    deployment.stream = stream
    deployment.stream.project = project
    const data = await service.createDeployments(uid, deployment)
    res.send(data.dataValues.id)
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

router.patch('/:id', authUtils.jwtCheck, async (req: any, res: any) => {
  const uid = userUtils.getUserUid(req.user.sub)
  const stream = req.body.stream as Stream ?? null
  const project = req.body.project as Project ?? null
  try {
    if (project != null) {
      await api.updateProjectToCore(req.headers.authorization, project)
    }

    if (stream != null) {
      await api.updateStreamToCore(req.headers.authorization, stream)
    }

    await service.updateDeployments(uid, req.params.id)
    res.send('Update Success')
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

router.delete('/:id', authUtils.jwtCheck, async (req: any, res: any) => {
  const uid = userUtils.getUserUid(req.user.sub)
  try {
    const data = await service.deleteDeployment(uid, req.params.id)
    res.send(data)
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

router.post('/:id/assets', (req: any, res: any) => {
  console.log('test')
})

export default router
