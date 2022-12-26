import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, Unique, Default, BelongsTo } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import Guardian from '../../guardians/guardian.model'

@Table({
  paranoid: false,
  tableName: 'GuardianCheckIns'
})
export default class GuardianCheckin extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

  @Unique
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  guid!: string

  @Column(DataType.DATE)
  measuredAt!: Date

  @Column(DataType.DATE)
  queuedAt!: Date

  @Column(DataType.INTEGER)
  requestLatencyApi!: number

  @Column(DataType.INTEGER)
  requestLatencyGuardian!: number

  @Column(DataType.INTEGER)
  requestSize!: number

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianCheckin])
