import { AllowNull, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, Unique, Default } from 'sequelize-typescript'
import db from '../common/db/guardian'

@Table({
  paranoid: false,
  tableName: 'GuardianSites'
})
export default class GuardianSite extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  guid!: string

  @Column(DataType.STRING)
  name!: string

  @Column(DataType.STRING)
  description!: string

  @Default(false)
  @Column(DataType.BOOLEAN)
  isActive!: boolean

  @Column(DataType.UUID)
  cartodbMapId!: string

  @Column(DataType.STRING)
  flickrPhotosetId!: string

  @Column(DataType.INTEGER)
  timezoneOffset!: number

  @Default('UTC')
  @Column(DataType.STRING)
  timezone!: string

  @Column(DataType.TEXT)
  bounds!: string

  @Column(DataType.STRING)
  mapImageUrl!: string

  @Column(DataType.STRING)
  globeIconUrl!: string

  @Column(DataType.STRING)
  classyCampaignId!: string

  @Column(DataType.INTEGER)
  protectedArea!: number

  @Column(DataType.TEXT)
  backstory!: string

  @Default(false)
  @Column(DataType.BOOLEAN)
  isPrivate!: boolean

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date
}

db.sequelize.addModels([GuardianSite])
