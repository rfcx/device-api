import { BelongsTo, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, Min, IsInt, IsDate } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import Guardian from '../../guardians/guardian.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaDiskUsage'
})
export default class GuardianMetaDiskUsage extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

  @IsDate
  @Column(DataType.DATE(3))
  measuredAt!: Date

  @IsInt
  @Min(0)
  @Column(DataType.BIGINT)
  internalBytesAvailable!: number

  @IsInt
  @Min(0)
  @Column(DataType.BIGINT)
  internalBytesUsed!: number

  @IsInt
  @Min(0)
  @Column(DataType.BIGINT)
  externalBytesAvailable!: number

  @IsInt
  @Min(0)
  @Column(DataType.BIGINT)
  externalBytesUsed!: number

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaDiskUsage])
