import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { ProjectResponse } from '../types'
import * as api from '../common/core-api'
import { mapProjectsToOffTimes, mapProjectToOffTimes } from './serializer'

const router = Router()

router.get('/', (req: Request, res: Response, next: NextFunction): void => {
  const userToken = req.headers.authorization ?? ''
  api.getProjects(userToken, req.query).then(async (projects) => {
    const mappedProjects = await mapProjectsToOffTimes(projects)
    res.send(mappedProjects)
  }).catch(next)
})

router.get('/:id', (req: Request, res: Response, next: NextFunction): void => {
  const userToken = req.headers.authorization ?? ''
  api.getProject(userToken, req.params.id).then(async (project) => {
    const mappedProjects = await mapProjectToOffTimes(project)
    res.send(mappedProjects)
  }).catch(next)
})

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
  const userToken = req.headers.authorization ?? ''
  const project = req.body as ProjectResponse
  // TODO validation
  api.createProject(userToken, project).then(projectId => {
    res.send(projectId)
  }).catch(next)
})

export default router
