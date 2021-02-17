import { Router } from 'express'
import multer from 'multer'

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

router.get('/', async (req: any, res: any) => {
  
})

export default router