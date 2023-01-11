import { BelongsTo, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, IsInt, Min, IsDate } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import Guardian from '../../guardians/guardian.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaInstructionsQueue'
})
export default class GuardianMetaInstructionsQueue extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number

  @IsDate
  @Column(DataType.DATE(3))
  queuedAt!: Date

  @IsDate
  @Column(DataType.DATE(3))
  executeAt!: Date

  @IsDate
  @Column(DataType.DATE(3))
  receivedAt!: Date

  @Column(DataType.STRING)
  type!: string

  @Column(DataType.STRING)
  command!: string

  @Column(DataType.STRING)
  metaJson!: string

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  dispatchAttempts!: number

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaInstructionsQueue])
