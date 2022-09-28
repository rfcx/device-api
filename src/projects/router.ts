import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { ProjectResponse } from '../types'
import * as api from '../common/core-api'
import { getOfftimeByProjectId } from './serializer'

const router = Router()

router.get('/', (req: Request, res: Response, next: NextFunction): void => {
  const userToken = req.headers.authorization ?? ''
  api.getProjects(userToken, req.query).then(projects => {
    res.send(projects)
  }).catch(next)
})

router.get('/:id', (req: Request, res: Response, next: NextFunction): void => {
  const userToken = req.headers.authorization ?? ''
  api.getProject(userToken, req.params.id).then(project => {
    res.send(project)
  }).catch(next)
})

router.get('/:id/offtimes', (req: Request, res: Response, next: NextFunction): void => {
  getOfftimeByProjectId(req.params.id).then(offtime => {
    res.send(offtime)
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
