import { BelongsTo, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, Min, IsInt } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import Guardian from '../../guardians/guardian.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaCPU'
})
export default class GuardianMetaCPU extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

  @Column(DataType.DATE(3))
  measuredAt!: Date

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  cpuPercent!: number

  @IsInt
  @Column(DataType.INTEGER)
  cpuClock!: number

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaCPU])
