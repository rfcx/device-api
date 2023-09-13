import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response, next: NextFunction): void => {
  // static data before we created Core API for tflite model
  const classifiers = [
    {
      id: '1617208867756',
      name: 'chainsaw',
      version: '5',
      path: 'https://rfcx-install.s3.eu-west-1.amazonaws.com/rfcx-guardian/guardian-asset-classifier/1617208867756.tflite.gz',
      type: 'tflite',
      sha1: 'accfb018701e52696835c9d1c02600a67a228db1',
      sample_rate: '12000',
      input_gain: '1.0',
      window_size: '0.9750',
      step_size: '1',
      classifications: 'chainsaw,environment',
      classifications_filter_threshold: '0.95,1.00'
    },
    {
      id: '1692966951000',
      name: 'asian-elephant-edge',
      version: '3',
      path: 'https://rfcx-install.s3.eu-west-1.amazonaws.com/rfcx-guardian/guardian-asset-classifier/1692966951000.tflite.gz',
      type: 'tflite',
      sha1: 'f809836421d42fa529032b8fb4567f7995801ed9',
      sample_rate: '16000',
      input_gain: '1.0',
      window_size: '2.5000',
      step_size: '2.0000',
      classifications: 'elephas_maximus_courtship_song,elephas_maximus_simple_call,elephas_maximus_simple_call_2,elephas_maximus_territorial_song',
      classifications_filter_threshold: '0.98,0.98,0.98,0.98'
    }
  ]
  res.json(classifiers)
})

export default router
