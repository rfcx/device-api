import config from '../../config'
import { User, DeploymentRequest } from '../../types'
import { EmailMessage } from './email'
import mandrill from 'mandrill-api'
import axios from 'axios'
import dayjs from 'dayjs'
import { DEFAULT_FROM, renderEmail } from '@rfcx/notification-templates'

const sendEmailViaNotifyGateway = async (message: EmailMessage): Promise<string> => {
  await axios.post(config.EMAIL_SEND_URL, message, {
    headers: {
      Authorization: `Bearer ${config.EMAIL_SEND_TOKEN}`
    },
    timeout: 10000
  })
  return 'Message sent'
}

const sendEmailViaMandrill = async (message: EmailMessage): Promise<string> => {
  const mandrillClient = new mandrill.Mandrill(config.MANDRILL_KEY)
  return await new Promise((resolve, reject) => {
    mandrillClient.messages.send({ message: message, async: true },
      () => {
        resolve('Message sent')
      }, (error) => {
        reject(error)
      })
  })
}

const sendEmailWithMessage = async (message: EmailMessage): Promise<string> => {
  if (config.EMAIL_SEND_URL !== '' && config.EMAIL_SEND_TOKEN !== '') {
    try {
      return await sendEmailViaNotifyGateway(message)
    } catch (error) {
      if (config.MANDRILL_KEY === '') throw error
    }
  }
  return await sendEmailViaMandrill(message)
}

export default {
  sendNewDeploymentSuccessEmail: async (deployment: DeploymentRequest, user: User) => {
    if (user.email === null || user.email === undefined || user.email === 'Email') return
    let type = 'recording'
    if (deployment.deploymentType === 'guardian') {
      type = 'Guardian'
    } else if (deployment.deploymentType === 'songmeter') {
      type = 'Song Meter'
    } else if (deployment.deploymentType === 'audiomoth') {
      type = 'AudioMoth'
    }
    const deployedAt = dayjs(deployment.deployedAt).toDate()
    const rendered = renderEmail('device.deploymentSuccess', {
      deviceType: type,
      date: deployedAt.toLocaleDateString(),
      time: deployedAt.toLocaleTimeString()
    })
    const msg = {
      text: rendered.text,
      subject: rendered.subject,
      html: rendered.html,
      from_email: DEFAULT_FROM.rfcx.email,
      from_name: DEFAULT_FROM.rfcx.name,
      to: [{
        email: user.email,
        name: user.name,
        type: 'to'
      }],
      auto_html: true
    }
    return await sendEmailWithMessage(msg)
  }
}
