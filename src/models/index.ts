import config from '../config'
import { Sequelize } from 'sequelize'
import Deployment from './deployments/deployment'

const options = {
  dialect: 'postgres',
  dialectOptions: {
    ssl: config.DB_SSL_ENABLED === 'true'
  },
  host: config.DB_HOSTNAME,
  port: config.DB_PORT,
  logging: false,
  define: {
    underscored: true,
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci'
    },
    timestamps: true
  },
  migrationStorageTableName: 'migrations',
  migrationStorageTableSchema: 'sequelize',
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
sequelize.authenticate() // check connection

const models = {
  Deployment: Deployment(sequelize, Sequelize)
}

// Create associations
Object.keys(models).forEach(function (modelName) {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models)
  }
})

module.exports = { ...models, sequelize, Sequelize, options }
