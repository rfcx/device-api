import type { Request, Response, NextFunction } from 'express'
import { QueryTypes } from 'sequelize'
import { Sequelize, DataType } from 'sequelize-typescript'
import * as fs from 'fs'
import * as path from 'path'
import express, { Express } from 'express'
import Deployment from '../../deployments/deployment.model'
import Asset from '../../assets/asset.model'
import GuardianLog from '../../guardian-log/guardian-log.model'
import Guardian from '../../guardians/guardian.model'
import GuardianSite from '../../guardian-sites/guardian-site.model'

interface Migration {
  name: string
}

type DbType = 'device' | 'guardian'

// Copied from StackOverflow - only to be used for testing
export async function migrate (sequelize: Sequelize, type: DbType, table = 'SequelizeMeta'): Promise<void> {
  const migrationsPath = path.join(__dirname, `../../../migrations-${type}`)
  const migrations = fs.readdirSync(migrationsPath)
  await sequelize.query(`CREATE TABLE IF NOT EXISTS ${table} (name VARCHAR(255) NOT NULL UNIQUE)`)
  const completedMigrations = await sequelize.query<Migration>(`SELECT * FROM ${table}`, { type: QueryTypes.SELECT })

  for (const migration of completedMigrations) {
    const index = migrations.indexOf(migration.name)
    if (index !== -1) {
      migrations.splice(index, 1)
    }
  }

  const query = sequelize.getQueryInterface().sequelize.query
  const regex = /(create_hypertable|CREATE INDEX|DELETE FROM .* USING|pg_get_serial_sequence)/ // unsupported by sqlite
  sequelize.getQueryInterface().sequelize.query = async (sql: string, options: any): Promise<any> => {
    if (regex.test(sql)) {
      return await Promise.resolve()
    }
    return await query.call(sequelize.getQueryInterface().sequelize, sql, options)
  }

  for (const filename of migrations) {
    const migration = require(path.join(migrationsPath, filename)) // eslint-disable-line @typescript-eslint/no-var-requires
    try {
      await migration.up(sequelize.getQueryInterface(), DataType)
      await sequelize.query(`INSERT INTO ${table} VALUES (:name)`, { type: QueryTypes.INSERT, replacements: { name: filename } })
    } catch (err) {
      console.error(`Failed performing migration: ${filename}`, err)
      break
    }
  }

  sequelize.getQueryInterface().sequelize.query = query
}

const primarySub = 'sub-for-test'
const primaryName = 'John'
const primaryEmail = 'John@test.org'
const site1Guid = 'site1'
const guardian1Guid = '8xmoztfkc77h'
const guardian1Token = 'token 1'
export const seedValues = { primarySub, primaryName, primaryEmail, site1Guid, guardian1Guid, guardian1Token }

export async function seedDevice (): Promise<void> {
  await Deployment.create({ id: '0123456789101112', streamId: 'abcdefghijkl', deploymentType: 'audiomoth', deployedAt: '2021-05-12T05:21:21.960Z', isActive: true, createdById: primarySub })
}

export async function truncateDevice (): Promise<void> {
  await Asset.destroy({ where: {}, force: true })
  await GuardianLog.destroy({ where: {}, force: true })
  await Deployment.destroy({ where: {}, force: true })
}

export async function seedGuardian (): Promise<void> {
  const site1 = await GuardianSite.create({ id: 1, guid: site1Guid, name: 'Site 1' })
  await Guardian.create({ guid: guardian1Guid, shortname: 'Guardian 1', latitude: 37.88658142, longitude: -122.1433334, altitude: 30, authTokenSalt: '764hnca1c46cgxky4vq42n677v16wpcxvgsqnr3qqn20lipei6gnf1vq0z7193', authTokenHash: '320f7ed2baeceac675a0ae644df3902494b4a152', authTokenUpdatedAt: '2017-08-24 02:25:16.928+00', authTokenExpiresAt: '2030-08-24 02:25:16+00', streamId: 'a033fdd5ef07', timezone: 'America/Los_Angeles', creator: primaryEmail, siteId: site1.id })
}

export async function truncateGuardian (): Promise<void> {
  await Guardian.destroy({ where: {}, force: true })
  await GuardianSite.destroy({ where: {}, force: true })
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

export default { migrate, truncateDevice, truncateGuardian, expressApp, seedDevice, seedGuardian, seedValues }
