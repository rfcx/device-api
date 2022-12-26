import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, BelongsTo } from 'sequelize-typescript'
import Guardian from '../../guardians/guardian.model'
import db from '../../common/db/guardian'
import GuardianSoftware from '../../guardian-software/models/guardian-software.model'
import GuardianSoftwareVersion from '../../guardian-software/models/guardian-software-version.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaUpdateCheckIns'
})
export default class GuardianMetaUpdateCheckIn extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

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

db.sequelize.addModels([GuardianMetaUpdateCheckIn])
