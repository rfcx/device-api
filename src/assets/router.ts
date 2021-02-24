import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { downloadAsStream } from '../common/storage'
import assetDao from '../assets/dao'
import { assetPath } from '../common/storage/paths'

const router = Router()

router.get('/:id', (req: Request, res: Response, next: NextFunction): void => {
  assetDao.get(req.params.id).then(asset => {
    if (asset === null) {
      res.status(404).send('Not found')
    } else {
      res.header('Content-Type', asset.mimeType)
      const path = assetPath(asset)
      downloadAsStream(path).pipe(res)
    }
  }).catch(next)
})

export default router
