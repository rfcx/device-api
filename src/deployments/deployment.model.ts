import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript'

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

  @Column(DataType.STRING(16))
  deploymentType!: string

  @Column(DataType.DATE)
  deployedAt!: Date

  @Column(DataType.BOOLEAN)
  isActive!: Boolean

  @Column(DataType.STRING(36))
  createdById!: String

  @Column(DataType.STRING)
  deviceParameters?: String

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @DeletedAt
  deletedAt!: Date
}
