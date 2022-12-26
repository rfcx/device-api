import { BelongsTo, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, Min, IsInt } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import Guardian from '../../guardians/guardian.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaSegmentsQueue'
})
export default class GuardianMetaSegmentsQueue extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

  @Column(DataType.STRING)
  groupGuid!: string

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  segmentId!: number

  @Column(DataType.DATE(3))
  queuedAt!: Date

  @Column(DataType.DATE(3))
  receivedAt!: Date

  @Column(DataType.STRING)
  protocol!: string

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  dispatchAttempts!: number

  @Column(DataType.TEXT('long' as any))
  body!: string

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaSegmentsQueue])
