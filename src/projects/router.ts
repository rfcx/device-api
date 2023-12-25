import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { ProjectResponse } from '../types'
import * as api from '../common/core-api'
import { getOfftimeByProjectId } from './serializer'
import { httpErrorHandler } from '@rfcx/http-utils'

const router = Router()

router.get('/', (req: Request, res: Response, next: NextFunction): void => {
  const userToken = req.headers.authorization ?? ''
  api.getProjects(userToken, req.query).then(projects => {
    res.send(projects)
  }).catch(httpErrorHandler(req, res, 'Failed getting projects.'))
})

router.get('/:id', (req: Request, res: Response, next: NextFunction): void => {
  const userToken = req.headers.authorization ?? ''
  api.getProject(userToken, req.params.id).then(project => {
    res.send(project)
  }).catch(httpErrorHandler(req, res, 'Failed getting project.'))
})

router.get('/:id/offtimes', (req: Request, res: Response, next: NextFunction): void => {
  getOfftimeByProjectId(req.params.id).then(offtime => {
    res.send(offtime)
  }).catch(httpErrorHandler(req, res, 'Failed getting project off times.'))
})

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
  const userToken = req.headers.authorization ?? ''
  const project = req.body as ProjectResponse
  // TODO validation
  api.createProject(userToken, project).then(projectId => {
    res.send(projectId)
  }).catch(httpErrorHandler(req, res, 'Failed creating project.'))
})

export default router
