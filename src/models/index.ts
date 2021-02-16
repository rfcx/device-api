import config from '../config'
import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import Deployment from './deployments/deployment'

const options: SequelizeOptions = {
  dialect: 'postgres',
  dialectOptions: {
    ssl: config.DB_SSL_ENABLED === 'true'
  },
  host: config.DB_HOSTNAME,
  port: +config.DB_PORT,
  logging: false,
  define: {
    underscored: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: true
  },
  hooks: {
    afterConnect: () => {
      console.log('Connected to Postgres')
    },
    afterDisconnect: () => {
      console.log('Disonnected from Postgres')
    }
  }
}
const sequelize = new Sequelize(config.DB_DBNAME, config.DB_USER, config.DB_PASSWORD, options)
sequelize.addModels([Deployment])

const models = {
  Deployment: Deployment
}

export default { ...models, sequelize, Sequelize, options }
