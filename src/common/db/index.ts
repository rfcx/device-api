import config from '../../config'
import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import path from 'path'

const baseOptions: SequelizeOptions = {
  logging: false,
  define: {
    underscored: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: true,
    paranoid: true
  },
  models: [path.join(__dirname, '../../**/*.model.*')]
}

const dbConfigPostgres: SequelizeOptions = {
  dialect: 'postgres',
  dialectOptions: {
    ssl: config.DB_SSL_ENABLED
      ? {
          require: true,
          rejectUnauthorized: false // Ref.: https://github.com/brianc/node-postgres/issues/2009
        }
      : false
  },
  host: config.DB_HOSTNAME,
  port: config.DB_PORT
}

const options: SequelizeOptions = {
  ...baseOptions,
  ...dbConfigPostgres
}

const sequelize = new Sequelize(config.DB_DBNAME, config.DB_USER, config.DB_PASSWORD, options)

export default { sequelize }
