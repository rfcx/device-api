import config from '../config'
import { connect, MqttClient, QoS } from 'mqtt'
import { randomString } from '../common/hash'
import { guid } from '../common/guid'
import { processCheckinMessage, processPingMessage } from './service'
import { MqttMessageProcessResult } from '../types'

const CHECKINS_TOPIC_NAME = 'grd/+/chk'
const PINGS_TOPIC_NAME = 'grd/+/png'

export const listen = function (): void {
  const connectionOptions = {
    clientId: `rfcx-api-mqtt-${config.NODE_ENV}-${randomString(6)}`,
    host: config.MQTT_BROKER_HOST,
    port: config.MQTT_BROKER_PORT,
    protocol: 'tcp' as any,
    username: config.MQTT_BROKER_USER,
    password: config.MQTT_BROKER_PASSWORD,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    qos: 2,
    connectTimeout: 2000,
    debug: true
  }

  const app = connect(connectionOptions)

  app.on('error', (err) => console.error('MQTT: Error', err))
  app.on('reconnect', () => console.info('MQTT: Reconnected'))
  app.on('close', () => console.info('MQTT: Closed'))
  app.on('connect', () => onConnect(app))
  app.on('message', (topic, data) => onMessage(app, topic, data))
}

export const onConnect = function (app: MqttClient): void {
  console.info(`MQTT: Connected ${app.options.protocol as string}://${app.options.host as string}:${app.options.port as number}) (${config.NODE_ENV})`)
  subscribe(app, CHECKINS_TOPIC_NAME)
  subscribe(app, PINGS_TOPIC_NAME)
}

export const subscribe = function (app: MqttClient, topic: string): void {
  const subscriptionOptions = { qos: 2 as QoS }
  app.unsubscribe(topic, (err: Error) => {
    if (err !== undefined || err !== null) {
      console.error(`MQTT: could not unsubscribe from topic "${topic}"`, err)
      return
    }
    console.info(`MQTT: unsubscribed from topic "${topic}"`)
    app.subscribe(topic, subscriptionOptions, (err, granted) => {
      if (err !== undefined || err !== null) {
        console.error(`MQTT: could not subscribe to topic "${topic}"`, err)
        return
      }
      console.info(`MQTT: subscribed to topic "${topic}"`, granted)
    })
  })
}

export const onMessage = function (app: MqttClient, topic: string, data: Buffer): void {
  const messageId = guid()
  const start = Date.now()
  let messageType
  console.info('MQTT: new mqtt message', topic, messageId)

  if (/grd\/.+\/chk/.test(topic)) {
    messageType = 'checkin'
    processCheckinMessage(data, messageId)
      .then((result: MqttMessageProcessResult) => {
        app.publish(`grd/${result.guardianGuid}/cmd`, result.gzip)
      })
      .catch((err) => { console.error('MQTT: message error', err) })
  } else if (/grd\/.+\/png/.test(topic)) {
    messageType = 'ping'
    processPingMessage(data, messageId)
      .then((result: MqttMessageProcessResult) => {
        if (Object.keys(result.obj).length > 0) {
          app.publish(`grd/${result.guardianGuid}/cmd`, result.gzip)
        }
      })
      .catch((err) => { console.error('MQTT: message error', err) })
  }
  console.info(`MQTT: ${messageType as string} message processed in ${(Date.now() - start) / 1000} seconds. Topic: "${topic}". Message id: "${messageId}"'`)
}
