import { BelongsTo, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import Guardian from '../../guardians/guardian.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaSegmentsGroupLogs'
})
export default class GuardianMetaSegmentsGroupLog extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number

  @Column(DataType.STRING)
  group_guid!: string

  @Column(DataType.STRING)
  url!: Date

  @Column(DataType.INTEGER)
  segmentCount!: number

  @Column(DataType.STRING)
  protocol!: string

  @Column(DataType.STRING)
  type!: string

  @Column(DataType.TEXT)
  payload!: string

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaSegmentsGroupLog])
