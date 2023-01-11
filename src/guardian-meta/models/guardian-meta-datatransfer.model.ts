import { BelongsTo, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, Min, IsInt, IsDate } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import Guardian from '../../guardians/guardian.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaDataTransfer'
})
export default class GuardianMetaDataTransfer extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number

  @IsDate
  @Column(DataType.DATE(3))
  startedAt!: Date

  @IsDate
  @Column(DataType.DATE(3))
  endedAt!: Date

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  mobileBytesReceived!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  mobileBytesSent!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  mobileTotalBytesReceived!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  mobileTotalBytesSent!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  networkBytesReceived!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  networkBytesSent!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  networkTotalBytesReceived!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  networkTotalBytesSent!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  bytesReceived!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  bytesSent!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  totalBytesReceived!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  totalBytesSent!: number

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaDataTransfer])
