import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, BelongsTo } from 'sequelize-typescript'
import Guardian from '../../guardians/guardian.model'
import db from '../../common/db/guardian'
import GuardianMetaSensor from './guardian-meta-sensor.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaSensorValues'
})
export default class GuardianMetaSensorValue extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number

  @Column(DataType.DATE(3))
  measuredAt!: Date

  @Column(DataType.FLOAT)
  value!: number

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian

  @BelongsTo(() => GuardianMetaSensor, 'sensorId')
  sensor!: GuardianMetaSensor
}

db.sequelize.addModels([GuardianMetaSensorValue])
