import config from '../../config'
import { User, DeploymentRequest } from '../../types'
import { EmailMessage } from './email'
import mandrill from 'mandrill-api'
import handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'
import dayjs from 'dayjs'

const mandrillClient = new mandrill.Mandrill(config.MANDRILL_KEY)

export const generateHTML = (deployment: DeploymentRequest, type: string): string => {
  const filePath = path.join(__dirname, './deploy-success-email-template.html')
  const source = fs.readFileSync(filePath).toString()
  const template = handlebars.compile(source)
  handlebars.registerHelper('ifEqual', (arg1, arg2, arg3, options) => {
    return (arg1 === arg2 || arg1 === arg3) ? options.fn(this) : options.inverse(this)
  })
  const deployedAt = dayjs(deployment.deployedAt).toDate()
  const date = deployedAt.toLocaleDateString()
  const time = deployedAt.toLocaleTimeString()
  const data = { date: date, time: time, type: type }
  return template(data)
}

const sendEmailWithMessage = async (message: EmailMessage): Promise<string> => {
  return await new Promise((resolve, reject) => {
    mandrillClient.messages.send({ message: message, async: true },
      () => {
        resolve('Message sent')
      }, (error) => {
        reject(error)
      })
  })
}

export default {
  sendNewDeploymentSuccessEmail: async (deployment: DeploymentRequest, user: User) => {
    if (user.email === null || user.email === undefined || user.email === 'Email') return
    let type = 'AudioMoth'
    if (deployment.deploymentType === 'guardian') {
      type = 'Guardian'
    } else if (deployment.deploymentType === 'songmeter') {
      type = 'Song Meter'
    }
    const msg = {
      text: `Your ${type} device was deployed successfully`,
      subject: `Your ${type} device was deployed successfully`,
      html: generateHTML(deployment, type),
      from_email: 'contact@rfcx.org',
      from_name: 'Rainforest Connection',
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
