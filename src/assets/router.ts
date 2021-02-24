import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import assetDao from '../assets/dao'

const router = Router()

router.get('/:id', (req: Request, res: Response, next: NextFunction): void => {
  assetDao.get(req.params.id).then(asset => {
    if (asset === null) {
      res.status(404).send('Not found')
    } else {
      res.send('TODO')
    }
  }).catch(next)
})

export default router
