import { AllowNull, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, Default, IsInt, Min, Unique, BelongsTo } from 'sequelize-typescript'
import GuardianCheckin from '../..//guardian-meta/models/guardian-checkin.model'
import GuardianSite from '../../guardian-sites/guardian-site.model'
import Guardian from '../../guardians/guardian.model'
import db from '../../common/db/guardian'

@Table({
  paranoid: false,
  tableName: 'GuardianAudioFormats'
})
export default class GuardianAudioFormat extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

  @Unique
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  guid!: string

  @Column(DataType.DATE(3))
  measuredAt!: Date

  @AllowNull(true)
  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  size!: number

  @AllowNull(true)
  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  captureSampleCount!: number

  @AllowNull(true)
  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  encodeDuration!: number

  @Unique(true)
  @AllowNull(true)
  @Column(DataType.STRING)
  sha1Checksum!: string

  @AllowNull(true)
  @Column(DataType.STRING)
  url!: string

  @AllowNull(true)
  @Column(DataType.STRING)
  originalFilename!: string

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian

  @BelongsTo(() => GuardianSite, 'guardianId')
  site!: GuardianSite

  @BelongsTo(() => GuardianCheckin, 'checkInId')
  checkin!: GuardianCheckin

  @BelongsTo(() => GuardianAudioFormat, 'formatId')
  format!: GuardianAudioFormat
}

db.sequelize.addModels([GuardianAudioFormat])
