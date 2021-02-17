import { Router } from 'express'
import moment from 'moment'
import dao from './dao'
import { DeploymentResponse, StreamResponse, ProjectResponse } from '../types'
import { jwtCheck } from '../common/auth'
import * as api from '../common/core-api'
import { getUserUid } from '../common/user'
import { mapStreamsAndDeployments } from './serializer'
import multer from 'multer'
import { uploadFile } from '../common/amazon'
import { getFileTypeFromBase64 } from '../common/mime'

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

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
    const data = await dao.createDeployment(uid, deployment)
    res.send(data.id)
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
      await api.updateProjectToCore(req.headers.authorization, project)
    }

    if (stream != null) {
      await api.updateStreamToCore(req.headers.authorization, stream)
    }

    await dao.updateDeployment(uid, req.params.id)
    res.send('Update Success')
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

router.delete('/:id', jwtCheck, async (req: any, res: any) => {
  const uid = getUserUid(req.user.sub)
  try {
    const data = await dao.deleteDeployment(uid, req.params.id)
    res.send(data)
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

router.post('/:id/assets', upload.single('file'), async (req: any, res: any) => {
  const imageBin = req.body.image
  const now = new Date().getMilliseconds()
  try {
    if(imageBin != null) {
      const stripedImageBin = imageBin.replace(/^data:image\/\w+;base64,/, '')
      const type = await getFileTypeFromBase64(stripedImageBin)
      if (type?.ext != null && ['jpg', 'png'].includes(type?.ext)) {
        const buf = Buffer.from(stripedImageBin, 'base64')
        const opt = {ContentEncoding: 'base64'}
        const remotePath = `${req.params.id}-${now}.${type.ext}`
        await uploadFile(remotePath, buf, opt)
      }
    } else {
      const buf = req.file.buffer
      const fileName = req.file.originalname
      const remotePath = `${req.params.id}-${now}-${fileName}`
      console.log(remotePath)
      await uploadFile(remotePath, buf)
    }
    res.send("Upload Asset Success")
  } catch (error) {
    console.log(error)
    res.status(400).send(error.message ?? error)
  }
})


export default router
