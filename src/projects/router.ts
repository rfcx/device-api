import { Router } from 'express'
import { ProjectResponse } from 'src/types'
import * as api from '../common/core-api'
import { jwtCheck } from '../common/auth'

const router = Router()

router.get('/', jwtCheck, async (req: any, res: any) => {
  try {
    const projects = await api.getProjects(req.headers.authorization)
    res.send(projects)
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

router.post('/', jwtCheck, async (req: any, res: any) => {
  const project = req.body as ProjectResponse
  try {
    const projectId = await api.createProject(req.headers.authorization, project)
    res.send(projectId)
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

export default router
