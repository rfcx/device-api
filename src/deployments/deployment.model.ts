import { Table, Column, Model, DataType, PrimaryKey, BelongsTo, Scopes, ForeignKey } from 'sequelize-typescript'
import Configuration from '../configurations/configuration.model'

@Scopes(() => ({
  full: {
    include: [Configuration]
  }
}))
@Table({
  paranoid: true,
  tableName: 'deployments'
})
export default class Deployment extends Model {
  @PrimaryKey
  @Column(DataType.STRING(16))
  id!: string

  @Column(DataType.STRING(12))
  streamId!: string

  @ForeignKey(() => Configuration)
  @BelongsTo(() => Configuration, { targetKey: 'id', as: 'configuration' })
  @Column(DataType.INTEGER)
  configurationId?: number

  @Column(DataType.STRING(16))
  deploymentType!: string

  @Column(DataType.DATE)
  deployedAt!: Date

  @Column(DataType.BOOLEAN)
  isActive!: Boolean

  @Column(DataType.STRING(36))
  createdById!: String
}
