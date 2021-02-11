import express from 'express'
import { deploymentsService, projectsService, streamsService } from '../../services'
import { Deployment, Stream, Project } from '../../types'
import { api } from '../../utils'
import { jwtCheck } from '../../utils/auth'

const router = express.Router()

router.get('/', jwtCheck, (req: any, res: any) => {
    const fullUid = req.user.sub
    const uid = fullUid.substring(fullUid.lastIndexOf('|') + 1, fullUid.length)
    const option = {
        isActive: req.query.is_active || true,
        limit: req.query.limit || 100,
        offset: req.query.offset || 0,
        joinRelations: true
    }
    deploymentsService.getDeployments(uid, option).then(data => {
        res.send(data)
    }).catch(err => {
        res.status(400).send(err)
    })
})

router.post('/', jwtCheck, async (req: any, res: any) => {
    const deployment = req.body as Deployment
    const stream = deployment.stream
    const project = stream.project as Project || null
    const fullUid = req.user.sub
    const uid = fullUid.substring(fullUid.lastIndexOf('|') + 1, fullUid.length)
    let projectId = project?.id || null
    let streamId = stream?.id || null
    try{
        // new stream
        if(!streamId) {
            // new project
            if (project && !projectId) {
                projectId = await api.createProjectToCore(req.headers.authorization, project)
                project.id = projectId
                await projectsService.createProject(uid, project)
        
                streamId = await api.createStreamToCore(req.headers.authorization, stream, projectId)
                stream.id = streamId
                await streamsService.createStream(uid, stream, projectId)
            // exist project
            } else {
                streamId = await api.createStreamToCore(req.headers.authorization, stream, projectId)
                stream.id = streamId
                await streamsService.createStream(uid, stream, projectId)
            }
        }
        deployment.stream = stream
        deployment.stream.project = project
        const data = await deploymentsService.createDeployments(uid, deployment)
        res.send(data.dataValues.id)
    } catch(error) {
        res.status(400).send(error)
    }
})

router.patch('/:id', jwtCheck, async (req: any, res: any) => {
    const fullUid = req.user.sub
    const uid = fullUid.substring(fullUid.lastIndexOf('|') + 1, fullUid.length)
    const stream = req.body.stream as Stream || null
    const project = req.body.project as Project || null
    if(project) {
        try {
            await api.updateProjectToCore(req.headers.authorization, project)
            await projectsService.updateProject(uid, project)
        } catch (err) {
            return res.status(400).send(err)
        }
    }

    if(stream) {
        try {
            await api.updateStreamToCore(req.headers.authorization, stream)
            await streamsService.updateStream(uid, stream)
        } catch (err) {
            return res.status(400).send(err)
        }
    }

    return res.send("Update Success")
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