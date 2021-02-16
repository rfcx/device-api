import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript'

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

  @Column(DataType.STRING)
  deploymentType!: string

  @Column(DataType.DATE)
  deployedAt!: Date

  @Column(DataType.BOOLEAN)
  isActive!: Boolean

  @Column(DataType.STRING(36))
  createdById!: String
}
