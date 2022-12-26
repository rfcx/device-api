import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, AllowNull, BelongsTo } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import GuardianMetaSensorComponent from './guardian-meta-sensor-component.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaSensors'
})
export default class GuardianMetaSensor extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

  @Column(DataType.INTEGER)
  componentId!: number

  @Column(DataType.INTEGER)
  payloadPosition!: number

  @AllowNull(true)
  @Column(DataType.STRING)
  name!: string

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => GuardianMetaSensorComponent, 'componentId')
  component!: GuardianMetaSensorComponent
}

db.sequelize.addModels([GuardianMetaSensor])
