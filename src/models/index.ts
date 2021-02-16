import config from '../config'
import { Model, Sequelize, SequelizeOptions } from 'sequelize-typescript'
import Deployment from './deployments/deployment'

const options: SequelizeOptions = {
  dialect: 'postgres',
  dialectOptions: {
    ssl: config.DB_SSL_ENABLED === 'true'
  },
  host: config.DB_HOSTNAME,
  port: 5432,
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

const models = {
  Deployment: Deployment(sequelize, Sequelize)
}

// Create associations
Object.keys(models).forEach(function (modelName) {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models)
  }
})

export default { ...models, sequelize, Sequelize, options }
