import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response, next: NextFunction): void => {
  // static data before we created Core API for tflite model
  const classifiers = [
    {
      id: '1617208867756',
      name: 'chainsaw',
      version: '1',
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
      id: '1637901623151',
      name: 'asia-elephant-edge',
      version: '2',
      path: 'https://rfcx-install.s3.eu-west-1.amazonaws.com/rfcx-guardian/guardian-asset-classifier/1637901623151.tflite.gz',
      type: 'tflite',
      sha1: '69482d8b65083e2fabcf1096033c863409cc50f7',
      sample_rate: '8000',
      input_gain: '1.0',
      window_size: '2.5000',
      step_size: '2.0000',
      classifications: 'elephas_maximus,environment',
      classifications_filter_threshold: '0.98,1.00'
    }
  ]
  res.json(classifiers)
})

export default router
