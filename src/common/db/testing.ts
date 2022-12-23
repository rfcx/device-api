import type { Request, Response, NextFunction } from 'express'
import { QueryTypes } from 'sequelize'
import { Sequelize, DataType } from 'sequelize-typescript'
import * as fs from 'fs'
import * as path from 'path'
import express, { Express } from 'express'
import Deployment from '../../deployments/deployment.model'
import Asset from '../../assets/asset.model'
import GuardianLog from '../../guardian-log/guardian-log.model'

interface Migration {
  name: string
}

// Copied from StackOverflow - only to be used for testing
export async function migrate (sequelize: Sequelize, table = 'SequelizeMeta'): Promise<void> {
  const migrations = fs.readdirSync(path.join(__dirname, '../../../migrations'))
  await sequelize.query(`CREATE TABLE IF NOT EXISTS ${table} (name VARCHAR(255) NOT NULL UNIQUE)`)
  const completedMigrations = await sequelize.query<Migration>(`SELECT * FROM ${table}`, { type: QueryTypes.SELECT })

  for (const migration of completedMigrations) {
    const index = migrations.indexOf(migration.name)
    if (index !== -1) {
      migrations.splice(index, 1)
    }
  }

  const query = sequelize.getQueryInterface().sequelize.query
  const regex = /(create_hypertable|INDEX|ADD CONSTRAINT|DROP CONSTRAINT|DELETE FROM .* USING)/ // unsupported by sqlite
  sequelize.getQueryInterface().sequelize.query = async (sql: string, options: any): Promise<any> => {
    if (regex.test(sql)) {
      // console.log('Skip unsupported query: ' + sql)
      return await Promise.resolve()
    }
    return await query.call(sequelize.getQueryInterface().sequelize, sql, options)
  }

  for (const filename of migrations) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const migration = require(path.join(__dirname, '../../../migrations', filename))
    try {
      await migration.up(sequelize.getQueryInterface(), DataType)
      await sequelize.query(`INSERT INTO ${table} VALUES (:name)`, { type: QueryTypes.INSERT, replacements: { name: filename } })
    } catch (err) {
      console.error('Failed performing migration: ' + filename)
      break
    }
  }

  sequelize.getQueryInterface().sequelize.query = query
}

const primarySub = 'sub-for-test'
const primaryName = 'John'
const primaryEmail = 'John@test.org'
export const seedValues = { primarySub, primaryName, primaryEmail }

export async function seed (): Promise<void> {
  await Deployment.create({ id: '0123456789101112', streamId: 'abcdefghijkl', deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: primarySub })
}

export async function truncate (): Promise<Number> {
  await Asset.destroy({ where: {}, force: true })
  await GuardianLog.destroy({ where: {}, force: true })
  return await Deployment.destroy({ where: {}, force: true })
}

export function muteConsole (levels = ['log', 'info', 'warn', 'error']): void {
  (typeof levels === 'string' ? [levels] : levels).forEach((f) => {
    console[f] = function () {}
  })
}

export function expressApp (): Express {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.user = {
      sub: primarySub,
      name: primaryName,
      email: primaryEmail
    }
    next()
  })
  return app
}

export default { migrate, truncate, expressApp, seed, seedValues }
