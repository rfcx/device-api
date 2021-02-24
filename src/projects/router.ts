import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { ProjectResponse } from '../types'
import * as api from '../common/core-api'

const router = Router()

router.get('/', async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try {
    const projects = await api.getProjects(req.headers.authorization)
    res.send(projects)
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

router.post('/', async (req: Request, res: Response, _next: NextFunction) => {
  const project = req.body as ProjectResponse
  try {
    const projectId = await api.createProject(req.headers.authorization, project)
    res.send(projectId)
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

export default router
