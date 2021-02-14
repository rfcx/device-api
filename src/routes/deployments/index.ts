import express from 'express'
import { deploymentsService } from '../../services'
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
    }).catch(error => {
        res.status(400).send(error.message || error)
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
    } catch(error) {
        res.status(400).send(error.message || error)
    }
})

router.patch('/:id', jwtCheck, async (req: any, res: any) => {
    const stream = req.body.stream as Stream || null
    const project = req.body.project as Project || null
    if(project) {
        try {
            await api.updateProjectToCore(req.headers.authorization, project)
        } catch (error) {
            return res.status(400).send(error.message || error)
        }
    }

    if(stream) {
        try {
            await api.updateStreamToCore(req.headers.authorization, stream)
        } catch (error) {
            return res.status(400).send(error.message || error)
        }
    }

    return res.send("Update Success")
})

router.delete('/:id', jwtCheck, (req: any, res: any) => {
    const fullUid = req.user.sub
    const uid = fullUid.substring(fullUid.lastIndexOf('|') + 1, fullUid.length)
    deploymentsService.deleteDeployment(uid, req.params.id).then(data => {
        res.send(data)
    }).catch(error => {
        res.status(400).send(error.message || error)
    })
})

router.post('/:id/assets', (req: any, res: any) => {
    

    console.log("test")
})

module.exports = router