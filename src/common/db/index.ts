import config from '../../config'
import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
type SequelizeInstanceType = 'device' | 'guardian'
interface dbExport {
  sequelize: Sequelize
  options: SequelizeOptions
}

const dbInstances = {}

function getOrCreateDbInstance (type: SequelizeInstanceType): dbExport {
  if (dbInstances[type] === undefined) {
    const options = getOptions(type)
    const sequelize = new Sequelize(options)
    dbInstances[type] = { options, sequelize }
  }
  return dbInstances[type]
}

function getOptions (type: SequelizeInstanceType): SequelizeOptions {
  const baseOptions: SequelizeOptions = {
    logging: false,
    define: {
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: true,
      paranoid: true,
      createdAt: 'created_at', // force sequelize to respect snake_case for created_at
      updatedAt: 'updated_at' // force sequelize to respect snake_case for updated_at
    }
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
    database: type === 'device' ? config.DB_DEVICE_NAME : config.DB_GUARDIAN_NAME,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    host: config.DB_HOSTNAME,
    port: config.DB_PORT
  }
  const dbConfigSqlite: SequelizeOptions = {
    dialect: 'sqlite'
  }

  const options: SequelizeOptions = {
    ...baseOptions,
    ...(process.env.NODE_ENV === 'test' ? dbConfigSqlite : dbConfigPostgres)
  }

  if (config.NODE_ENV === 'development') {
    options.logging = function (str) {
      console.info(`\n"${type}" query--------------------\n${str}\n----------------------------------`)
    }
  }
  return options
}

export default function (type: SequelizeInstanceType): dbExport {
  const { options, sequelize } = getOrCreateDbInstance(type)
  try {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    sequelize.authenticate()
  } catch (error) {
    console.error(`Unable to connect to the ${type} database:`, error)
  }
  return { sequelize, options }
}
