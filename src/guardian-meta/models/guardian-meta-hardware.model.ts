import { BelongsTo, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import Guardian from '../../guardians/guardian.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaHardware'
})
export default class GuardianMetaHardware extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

  @Column(DataType.STRING)
  phoneImei!: string

  @Column(DataType.STRING)
  phoneImsi!: string

  @Column(DataType.STRING)
  androidVersion!: string

  @Column(DataType.STRING)
  androidBuild!: string

  @Column(DataType.STRING)
  manufacturer!: string

  @Column(DataType.STRING)
  model!: string

  @Column(DataType.STRING)
  brand!: string

  @Column(DataType.STRING)
  product!: string

  @Column(DataType.STRING)
  phoneSimCarrier!: string

  @Column(DataType.STRING)
  phoneSimSerial!: string

  @Column(DataType.STRING)
  phoneSimNumber!: string

  @Column(DataType.STRING)
  iridiumImei!: string

  @Column(DataType.STRING)
  swarmSerial!: string

  @Column(DataType.STRING)
  sentinelVersion!: string

  @Column(DataType.STRING)
  sentryVersion!: string

  @Column(DataType.STRING)
  description!: string

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaHardware])
