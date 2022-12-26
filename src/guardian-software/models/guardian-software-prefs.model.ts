import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, BelongsTo } from 'sequelize-typescript'
import Guardian from '../../guardians/guardian.model'
import db from '../../common/db/guardian'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaUpdateCheckIns'
})
export default class GuardianMetaUpdateCheckIn extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

  @Column(DataType.STRING)
  prefKey!: string

  @Column(DataType.STRING)
  prefValue!: string

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaUpdateCheckIn])
