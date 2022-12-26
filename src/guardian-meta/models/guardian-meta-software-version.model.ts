import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, BelongsTo, Default, IsDate } from 'sequelize-typescript'
import Guardian from '../../guardians/guardian.model'
import db from '../../common/db/guardian'
import GuardianSoftware from '../../guardian-software/models/guardian-software.model'
import GuardianSoftwareVersion from '../../guardian-software/models/guardian-software-version.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaSoftwareVersions'
})
export default class GuardianMetaSoftwareVersion extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

  @IsDate
  @Default(DataType.NOW)
  @Column(DataType.DATE(3))
  lastCheckinAt!: Date

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => GuardianSoftware, 'roleId')
  role!: GuardianSoftware

  @BelongsTo(() => GuardianSoftwareVersion, 'versionId')
  version!: GuardianSoftwareVersion

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaSoftwareVersion])
