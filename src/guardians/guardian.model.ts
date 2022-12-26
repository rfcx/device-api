import { AllowNull, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, Unique, Default, IsFloat, Is, IsDate, Sequelize, BelongsTo } from 'sequelize-typescript'
import GuardianSite from '../guardian-sites/guardian-site.model'
import db from '../common/db/guardian'

@Table({
  paranoid: false,
  tableName: 'Guardians'
})
export default class Guardian extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  guid!: string

  @Unique
  @Column(DataType.STRING)
  shortname!: string

  @Default(false)
  @Column(DataType.BOOLEAN)
  isVisible!: boolean

  @Column(DataType.STRING)
  phoneNumber!: string

  @Column(DataType.STRING)
  carrierName!: string

  @Column(DataType.STRING)
  simCardId!: string

  @Default(false)
  @Column(DataType.BOOLEAN)
  isUpdatable!: boolean

  @IsFloat
  @Is('latitude', (value: number) => {
    if (value < -90 || value > 90) {
      throw new Error(`Latitude should be between -90 and 90. Currently ${value}`)
    }
  })
  @Column(DataType.DOUBLE)
  latitude!: number

  @IsFloat
  @Is('longitude', (value: number) => {
    if (value < -180 || value > 180) {
      throw new Error(`Longitude should be between -180 and 180. Currently ${value}`)
    }
  })
  @Column(DataType.DOUBLE)
  longitude!: number

  @IsFloat
  @Column(DataType.DOUBLE)
  altitude!: number

  @IsDate
  @Default(Sequelize.fn('NOW'))
  @Column(DataType.DATE)
  lastCheckIn!: Date

  @Unique
  @Column(DataType.STRING)
  authTokenSalt!: string

  @Unique
  @Column(DataType.STRING)
  authTokenHash!: string

  @IsDate
  @Default(Sequelize.fn('NOW'))
  @Column(DataType.DATE(3))
  authTokenUpdatedAt!: Date

  @IsDate
  @Default(Sequelize.fn('NOW'))
  @Column(DataType.DATE(3))
  authTokenExpiresAt!: Date

  @Column(DataType.STRING)
  authPinCode!: string

  @Default(false)
  @Column(DataType.BOOLEAN)
  isPrivate!: boolean

  @Column(DataType.STRING(12))
  streamId!: string

  @Column(DataType.STRING(12))
  projectId!: string

  @Column(DataType.STRING)
  creator!: string

  @Column(DataType.STRING(255))
  timezone!: string

  @IsDate
  @Column(DataType.DATE(3))
  lastDeployed!: Date

  @IsDate
  @Column(DataType.DATE(3))
  lastPing!: Date

  @IsDate
  @Column(DataType.DATE(3))
  lastAudioSync!: Date

  @IsDate
  @Column(DataType.DATE(3))
  lastBatteryMain!: Date

  @IsDate
  @Column(DataType.DATE(3))
  lastBatteryInternal!: Date

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => GuardianSite, 'siteId')
  guardian!: GuardianSite
}

db.sequelize.addModels([Guardian])
