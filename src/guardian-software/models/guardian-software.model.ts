import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, BelongsTo, AllowNull, Default } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import GuardianSoftwareVersion from './guardian-software-version.model'

@Table({
  paranoid: false,
  tableName: 'GuardianSoftware'
})
export default class GuardianSoftware extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  role!: string

  @Default(false)
  @Column(DataType.BOOLEAN)
  isAvailable!: boolean

  @Default(true)
  @Column(DataType.BOOLEAN)
  isUpdatable!: boolean

  @Default(false)
  @Column(DataType.BOOLEAN)
  isExtra!: boolean

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => GuardianSoftwareVersion, 'currentVersionId')
  currentVersion!: GuardianSoftwareVersion
}

db.sequelize.addModels([GuardianSoftware])
