import express from 'express'
import { deploymentsService, projectsService, streamsService } from '../../services'
import { Deployment, Stream, Project } from '../../types'
import { api } from '../../utils'
import { jwtCheck } from '../../utils/auth'

const router = express.Router()

router.get('/', jwtCheck, (req: any, res: any) => {
    const option = {
        isActive: req.query.is_active || true,
        limit: req.query.limit || 100,
        offset: req.query.offset || 0
    }
    deploymentsService.getDeployments(req.user.sub, option).then(data => {
        res.send(data)
    }).catch(err => {
        res.status(400).send(err)
    })
})

router.post('/', jwtCheck, async (req: any, res: any) => {
    const deployment = req.body as Deployment
    const stream = deployment.stream
    const project = stream.project as Project || null
    let projectId = project?.coreId || null
    let streamId = stream?.coreId || null
    // new stream
    if(!streamId) {
        // new project
        if (project && !projectId) {
            projectId = await api.createProjectToCore(req.headers.authorization, project)
            project.coreId = projectId
            await projectsService.createProject(req.user.sub, project, projectId)

            streamId = await api.createStreamToCore(req.headers.authorization, stream, projectId)
            stream.coreId = streamId
            await streamsService.createStream(req.user.sub, stream, streamId)
        // exist project
        } else {
            streamId = await api.createStreamToCore(req.headers.authorization, stream, projectId)
            stream.coreId = streamId
            await streamsService.createStream(req.user.sub, stream, streamId)
        }
    }

    deployment.stream = stream
    deployment.stream.project = project
    
    deploymentsService.createDeployments(req.user.sub, deployment).then(data => {
        res.send(data)
    }).catch(err => {
        res.status(400).send(err)
    })
})

router.patch('/:id', jwtCheck, async (req: any, res: any) => {
    const stream = req.body.stream as Stream || null
    const project = req.body.project as Project || null
    if(project) {
        try {
            await api.updateProjectToCore(req.headers.authorization, project)
            await projectsService.updateProject(req.user.sub, project)
            await deploymentsService.updateDeployment(req.user.sub, req.params.id, null, project)
        } catch (err) {
            return res.status(400).send(err)
        }
    }

    if(stream) {
        try {
            await api.updateStreamToCore(req.headers.authorization, stream)
            await streamsService.updateStream(req.user.sub, stream)
            await deploymentsService.updateDeployment(req.user.sub, req.params.id, stream)
        } catch (err) {
            return res.status(400).send(err)
        }
    }

    return res.send()
})

router.delete('/:id', jwtCheck, (req: any, res: any) => {
    deploymentsService.deleteDeployment(req.user.sub, req.params.id).then(data => {
        res.send(data)
    }).catch(err => {
        res.status(400).send(err)
    })
})

router.post('/:id/assets', (req: any, res: any) => {
    

    console.log("test")
})

module.exports = router