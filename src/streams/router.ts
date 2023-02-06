import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import * as api from '../common/core-api'
import assetDao from '../assets/dao'
import deploymentDao from '../deployments/dao'
import { mapStreamsAndDeployments, unZipDeploymentParameters } from './serializer'

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
    const deployments = await deploymentDao.getDeployments(streams.map(stream => stream.id))
    const deploymentsInfo = mapStreamsAndDeployments(streams, deployments)
    res.send(deploymentsInfo)
  }).catch(next)
})

router.get('/:id/assets', (req: Request, res: Response, next: NextFunction): void => {
  const streamId = req.params.id
  assetDao.query({ streamId }).then(results => {
    res.json(results)
  }).catch(next)
})

router.get('/:id/deployment/parameters', (req: Request, res: Response, next: NextFunction): void => {
  const streamId = req.params.id
  deploymentDao.getByStreamId(streamId).then(async (results) => {
    await unZipDeploymentParameters(results).then(params => {
      res.json(params)
    })
  }).catch(next)
})

export default router
