import express from 'express'
import { any } from 'sequelize/types/lib/operators'
import { deploymentsService } from '../../services'
import { Deployment, Stream, Project } from '../../types'
import { api, authUtils, userUtils, deploymentUtils } from '../../utils'

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
    const deployments = await deploymentsService.getDeployments(uid, option)
    const deploymentsForCompanion = await deploymentUtils.mapStreamsAndDeployments(streams.data, deployments)
    res.send(deploymentsForCompanion)
  } catch(error) {
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
    const data = await deploymentsService.createDeployments(uid, deployment)
    res.send(data.dataValues.id)
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

router.patch('/:id', authUtils.jwtCheck, async (req: any, res: any) => {
  const stream = req.body.stream as Stream ?? null
  const project = req.body.project as Project ?? null
  if (project != null) {
    try {
      await api.updateProjectToCore(req.headers.authorization, project)
    } catch (error) {
      return res.status(400).send(error.message ?? error)
    }
  }

  if (stream != null) {
    try {
      await api.updateStreamToCore(req.headers.authorization, stream)
    } catch (error) {
      return res.status(400).send(error.message ?? error)
    }
  }

  return res.send('Update Success')
})

router.delete('/:id', authUtils.jwtCheck, (req: any, res: any) => {
  const uid = userUtils.getUserUid(req.user.sub)
  deploymentsService.deleteDeployment(uid, req.params.id).then(data => {
    res.send(data)
  }).catch(error => {
    res.status(400).send(error.message ?? error)
  })
})

router.post('/:id/assets', (req: any, res: any) => {
  console.log('test')
})

module.exports = router
