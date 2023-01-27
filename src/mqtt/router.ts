import { Router } from 'express'
import { Converter } from '@rfcx/http-utils'
import { allowUserPath, allowVhostOrResourcePath, allowTopicPath } from './service'

const router = Router()

/**
 * @swagger
 *
 * /mqtt/user_path:
 *   post:
 *     summary: Endpoint for RabbitMQ broker authentication
 *     tags:
 *       - mqtt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       200:
 *         description: RabbitMQ always expects 200 status to be returned
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: allow | deny
 */
router.post('/user_path', (req, res) => {
  const converter = new Converter(req.body, {})
  converter.convert('username').toString()
  converter.convert('password').toString()

  return converter.validate()
    .then(async (params: { username: string, password: string }) => {
      const perm = await allowUserPath(params.username, params.password)
      return res.send(perm)
    })
    .catch(() => res.send('deny'))
})

/**
 * @swagger
 *
 * /mqtt/vhost_path:
 *   post:
 *     summary: Endpoint for RabbitMQ broker authentication
 *     tags:
 *       - mqtt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               vhost:
 *                 type: string
 *               ip:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       200:
 *         description: RabbitMQ always expects 200 status to be returned
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: allow | deny
 */
router.post('/vhost_path', (req, res) => {
  const converter = new Converter(req.body, {})
  converter.convert('username').toString()
  converter.convert('vhost').toString()
  converter.convert('ip').toString()

  return converter.validate()
    .then(async (params: { username: string, vhost: string, ip: string }) => {
      const perm = await allowVhostOrResourcePath(params.username)
      return res.send(perm)
    })
    .catch(() => res.send('deny'))
})

/**
 * @swagger
 *
 * /mqtt/resource_path:
 *   post:
 *     summary: Endpoint for RabbitMQ broker authentication
 *     tags:
 *       - mqtt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               vhost:
 *                 type: string
 *               resource:
 *                 type: string
 *               name:
 *                 type: string
 *               permission:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       200:
 *         description: RabbitMQ always expects 200 status to be returned
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: allow | deny
 */
router.post('/resource_path', (req, res) => {
  const converter = new Converter(req.body, {})
  converter.convert('username').toString()
  converter.convert('vhost').toString()
  converter.convert('resource').toString()
  converter.convert('name').toString()
  converter.convert('permission').toString()

  return converter.validate()
    .then(async (params: { username: string }) => {
      const perm = await allowVhostOrResourcePath(params.username)
      return res.send(perm)
    })
    .catch(() => res.send('deny'))
})

/**
 * @swagger
 *
 * /mqtt/topic_path:
 *   post:
 *     summary: Endpoint for RabbitMQ broker authentication
 *     tags:
 *       - mqtt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               vhost:
 *                 type: string
 *               resource:
 *                 type: string
 *               name:
 *                 type: string
 *               permission:
 *                 type: string
 *               routing_key:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       200:
 *         description: RabbitMQ always expects 200 status to be returned
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: allow | deny
 */
router.post('/topic_path', (req, res) => {
  const converter = new Converter(req.body, {})
  converter.convert('username').toString()
  converter.convert('vhost').toString()
  converter.convert('resource').toString()
  converter.convert('name').toString()
  converter.convert('permission').toString().isEqualToAny(['read', 'write'])
  converter.convert('routing_key').toString()

  return converter.validate()
    .then(async (params: { username: string, permission: 'read' | 'write', routing_key: string }) => {
      const perm = await allowTopicPath(params.username, params.permission, params.routing_key)
      return res.send(perm)
    })
    .catch(() => res.send('deny'))
})

export default router
