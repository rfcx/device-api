import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import * as api from '../common/core-api'
import assetDao from '../assets/dao'
import deploymentDao from '../deployments/dao'
import service from './service'
import { mapStreamsAndDeployments } from './serializer'
import { DeploymentQuery } from 'src/types'
import { httpErrorHandler } from '@rfcx/http-utils'

const router = Router()

/**
 * @swagger
 *
 * /streams:
 *   get:
 *     summary: Get list of streams along with deployments
 *     tags:
 *       - streams
 *     parameters:
 *       - name: keyword
 *         description: Match streams with name
 *         in: query
 *         type: string
 *       - name: organizations
 *         description: Match streams belonging to one or more organizations (by id)
 *         in: query
 *         type: array
 *       - name: projects
 *         description: Match streams belonging to one or more projects (by id)
 *         in: query
 *         type: array
 *       - name: created_by
 *         description: Match streams based on creator (can be `me` or a user guid)
 *         in: query
 *       - name: updated_after
 *         description: Only return streams that were updated since/after (iso8601 or epoch)
 *         in: query
 *         type: string
 *       - name: start
 *         description: Match streams starting after (iso8601 or epoch)
 *         in: query
 *         type: string
 *       - name: end
 *         description: Match streams starting before (iso8601 or epoch)
 *         in: query
 *         type: string
 *       - name: only_public
 *         description: Include public streams only
 *         in: query
 *         type: boolean
 *         default: false
 *       - name: only_deleted
 *         description: Include deleted streams only
 *         in: query
 *         type: boolean
 *         default: false
 *       - name: limit
 *         description: Maximum number of results to return
 *         in: query
 *         type: int
 *         default: 100
 *       - name: offset
 *         description: Number of results to skip
 *         in: query
 *         type: int
 *         default: 0
 *       - name: sort
 *         description: Order the results (comma-separated list of fields, prefix "-" for descending)
 *         in: query
 *         type: string
 *         example: is_public,-updated_at
 *         default: -updated_at
 *       - name: fields
 *         description: Customize included fields and relations
 *         in: query
 *         type: array
 *       - name: type
 *         description: Filter the results to only specify type
 *         in: query
 *         type: string
 *         example: guardian
 *     responses:
 *       200:
 *         description: List of streams objects along with deployments objects
 *         headers:
 *           Total-Items:
 *             schema:
 *               type: integer
 *             description: Total number of items without limit and offset.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stream'
 *       400:
 *         description: Invalid query parameters
 */
router.get('/', (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization ?? ''
  api.getStreams(token, req.query).then(async (streams) => {
    const queryOption = req.query as DeploymentQuery
    // Offset won't be used to query deployments
    const { offset, ...excludeOffset } = queryOption
    const deployments = await deploymentDao.getDeployments(streams.map(stream => stream.id), excludeOffset)
    const deploymentsInfo = mapStreamsAndDeployments(streams, deployments)
    res.send(deploymentsInfo)
  }).catch(httpErrorHandler(req, res, 'Failed getting streams.'))
})

router.get('/:id/assets', (req: Request, res: Response, next: NextFunction): void => {
  const streamId = req.params.id
  assetDao.query({ streamId }).then(results => {
    res.json(results)
  }).catch(httpErrorHandler(req, res, 'Failed getting stream assets.'))
})

router.get('/:id/deployment/parameters', (req: Request, res: Response, next: NextFunction): void => {
  const streamId = req.params.id
  service.getDeviceParametersByStreamId(streamId).then(result => {
    res.json(result)
  }).catch(httpErrorHandler(req, res, 'Failed getting deployment parameters.'))
})

export default router
