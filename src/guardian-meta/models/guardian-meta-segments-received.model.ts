import { BelongsTo, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, Min, IsInt } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import Guardian from '../../guardians/guardian.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaSegmentsReceived'
})
export class GuardianMetaSegmentsReceived extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number

  @Column(DataType.STRING)
  groupGuid!: string

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  segmentId!: number

  @Column(DataType.DATE(3))
  receivedAt!: Date

  @Column(DataType.STRING)
  protocol!: string

  @Column(DataType.STRING)
  originAddress!: string

  @Column(DataType.TEXT('long' as any))
  body!: string

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaSegmentsReceived])

export default GuardianMetaSegmentsReceived
