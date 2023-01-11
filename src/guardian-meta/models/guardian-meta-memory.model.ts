import { BelongsTo, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, Min, IsInt, Default } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import Guardian from '../../guardians/guardian.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaMemory'
})
export default class GuardianMetaMemory extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number

  @Column(DataType.DATE(3))
  measuredAt!: Date

  @IsInt
  @Min(0)
  @Default(0)
  @Column(DataType.BIGINT)
  systemBytesAvailable!: number

  @IsInt
  @Min(0)
  @Default(0)
  @Column(DataType.BIGINT)
  systemBytesUsed!: number

  @IsInt
  @Min(0)
  @Default(0)
  @Column(DataType.BIGINT)
  systemBytesMinimum!: number

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaMemory])
