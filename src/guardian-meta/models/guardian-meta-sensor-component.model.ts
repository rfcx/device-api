import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, AllowNull, HasMany } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import GuardianMetaSensor from './guardian-meta-sensor.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaSensorComponents'
})
export class GuardianMetaSensorComponent extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number

  @AllowNull(false)
  @Column(DataType.STRING)
  shortname!: string

  @Column(DataType.STRING)
  name!: string

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @HasMany(() => GuardianMetaSensor, 'componentId')
  sensor!: GuardianMetaSensor
}

db.sequelize.addModels([GuardianMetaSensorComponent])

export default GuardianMetaSensorComponent
