import { BelongsTo, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, Min, IsInt } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import Guardian from '../../guardians/guardian.model'
import GuardianCheckin from '../../guardian-checkin/guardian-checkin.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaMqttBrokerConnections'
})
export class GuardianMetaMqttBrokerConnection extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number

  @Column(DataType.DATE(3))
  connectedAt!: Date

  @Column(DataType.STRING)
  brokerUri!: string

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  connectionLatency!: number

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  subscriptionLatency!: number

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian

  @BelongsTo(() => GuardianCheckin, 'checkinId')
  checkin!: GuardianCheckin
}

db.sequelize.addModels([GuardianMetaMqttBrokerConnection])

export default GuardianMetaMqttBrokerConnection
