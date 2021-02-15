import express from 'express'
import { Project } from 'src/types'
import { api, authUtils } from '../../utils'

const router = express.Router()

router.get('/', authUtils.jwtCheck, async (req: any, res: any) => {
  try {
    const projects = await api.getProjectsFromCore(req.headers.authorization)
    res.send(projects)
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

router.post('/', authUtils.jwtCheck, async (req: any, res: any) => {
  const project = req.body as Project
  try {
    const projectId = await api.createProjectToCore(req.headers.authorization, project)
    res.send(projectId)
  } catch (error) {
    res.status(400).send(error.message ?? error)
  }
})

module.exports = router
