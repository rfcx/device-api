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
      downloadAsStream(path)
        .on('error', (e) => {
          // On NoSuchKey, InvalidKeyId, etc
          console.log(e)
          res.status(500).send('Unexpected error while getting an asset')
        })
        .pipe(res)
    }
  }).catch(next)
})

router.delete('/:id', (req: Request, res: Response, next: NextFunction): void => {
  assetDao.remove(req.params.id).then(row => {
    if (row === 0) {
      res.status(404).send('Not found')
    } else {
      res.status(204).send()
    }
  }).catch(next)
})

export default router
