import { BelongsTo, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, Min, IsInt } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import Guardian from '../../guardians/guardian.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaBattery'
})
export default class GuardianMetaBattery extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number

  @Column(DataType.DATE(3))
  measuredAt!: Date

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  batteryPercent!: number

  @IsInt
  @Column(DataType.INTEGER)
  batteryTemperature!: number

  @Column(DataType.BOOLEAN)
  isCharging!: boolean

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaBattery])
