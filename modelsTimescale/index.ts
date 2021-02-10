const Sequelize = require('sequelize')
const utils = require('../utils/sequelize')

const options = {
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.POSTGRES_SSL_ENABLED === 'true'
  },
  host: process.env.POSTGRES_HOSTNAME,
  port: process.env.POSTGRES_PORT,
  logging: false,
  define: {
    underscored: true,
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci'
    },
    timestamps: true,
    createdAt: 'created_at', // force sequelize to respect snake_case for created_at
    updatedAt: 'updated_at' // force sequelize to respect snake_case for updated_at
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

const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, options)
sequelize.authenticate() // check connection

const models = {
  User: require('./users/user')(sequelize, Sequelize),
  Project: require('./projects/project')(sequelize, Sequelize),
  Stream: require('./streams/stream')(sequelize, Sequelize),
  Deployment: require('./deployments/deployments')(sequelize, Sequelize)
}

// Create associations
Object.keys(models).forEach(function (modelName) {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models)
  }
})

module.exports = { ...models, sequelize, Sequelize, options, utils }
