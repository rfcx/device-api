import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, BelongsTo, IsInt, Min, Max } from 'sequelize-typescript'
import Guardian from '../../guardians/guardian.model'
import db from '../../common/db/guardian'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaSentinelPower'
})
export default class GuardianMetaSentinelPower extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number

  @Column(DataType.DATE(3))
  measuredAt!: Date

  @IsInt
  @Column(DataType.INTEGER)
  systemTemperature!: number

  @IsInt
  @Column(DataType.INTEGER)
  systemVoltage!: number

  @IsInt
  @Column(DataType.INTEGER)
  systemPower!: number

  @IsInt
  @Column(DataType.INTEGER)
  inputVoltage!: number

  @IsInt
  @Column(DataType.INTEGER)
  inputCurrent!: number

  @IsInt
  @Column(DataType.INTEGER)
  inputPower!: number

  @Min(0)
  @Max(100)
  @IsInt
  @Column(DataType.INTEGER)
  batteryStateOfCharge!: number

  @IsInt
  @Column(DataType.INTEGER)
  batteryVoltage!: number

  @IsInt
  @Column(DataType.INTEGER)
  batteryCurrent!: number

  @IsInt
  @Column(DataType.INTEGER)
  batteryPower!: number

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaSentinelPower])
