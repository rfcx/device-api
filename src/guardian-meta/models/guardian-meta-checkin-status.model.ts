import { BelongsTo, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, Min, IsInt } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import Guardian from '../../guardians/guardian.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaCheckInStatus'
})
export default class GuardianMetaCheckInStatus extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number

  @Column(DataType.DATE(3))
  measuredAt!: Date

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  queuedCount!: number

  @IsInt
  @Min(0)
  @Column(DataType.BIGINT)
  queuedSizeBytes!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  skippedCount!: number

  @IsInt
  @Min(0)
  @Column(DataType.BIGINT)
  skippedSizeBytes!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  stashedCount!: number

  @IsInt
  @Min(0)
  @Column(DataType.BIGINT)
  stashedSizeBytes!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  sentCount!: number

  @IsInt
  @Min(0)
  @Column(DataType.BIGINT)
  sentSizeBytes!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  archivedCount!: number

  @IsInt
  @Min(0)
  @Column(DataType.BIGINT)
  archivedSizeBytes!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  metaCount!: number

  @IsInt
  @Min(0)
  @Column(DataType.BIGINT)
  metaSizeBytes!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  vaultCount!: number

  @IsInt
  @Min(0)
  @Column(DataType.BIGINT)
  vaultSizeBytes!: number

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaCheckInStatus])
