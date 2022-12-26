import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, BelongsTo, AllowNull, Default, IsDate, IsInt, Min, IsUrl } from 'sequelize-typescript'
import GuardianSoftware from './guardian-software.model'
import db from '../../common/db/guardian'

@Table({
  paranoid: false,
  tableName: 'GuardianSoftwareVersions'
})
export default class GuardianSoftwareVersion extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  version!: string

  @IsDate
  @Default(DataType.NOW)
  @Column(DataType.DATE(3))
  releaseDate!: Date

  @Column(DataType.BOOLEAN)
  isAvailable!: boolean

  @Column(DataType.STRING)
  sha1Checksum!: string

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  size!: number

  @IsUrl
  @Column(DataType.STRING)
  url!: string

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => GuardianSoftware, 'softwareRoleId')
  softwareRole!: GuardianSoftware
}

db.sequelize.addModels([GuardianSoftwareVersion])
