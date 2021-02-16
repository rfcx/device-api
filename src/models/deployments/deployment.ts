import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript'

@Table({
  underscored: true,
  timestamps: true,
  paranoid: true,
  tableName: 'deployments',
  modelName: 'deployment'
})
export default class Deployment extends Model {
  @PrimaryKey
  @Column(DataType.STRING(16))
  id!: string

  @Column(DataType.STRING)
  streamId!: string

  @Column(DataType.STRING)
  deploymentType!: string

  @Column(DataType.DATE)
  deployedAt!: Date

  @Column(DataType.BOOLEAN)
  isActive!: Boolean

  @Column(DataType.STRING)
  createdById!: String
}
