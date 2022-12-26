import { BelongsTo, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import Guardian from '../../guardians/guardian.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaReboots'
})
export default class GuardianMetaReboot extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

  @Column(DataType.DATE(3))
  attemptedAt!: Date

  @Column(DataType.DATE(3))
  completedAt!: Date

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaReboot])
