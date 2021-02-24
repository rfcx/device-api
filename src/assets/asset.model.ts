import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript'

@Table({
  tableName: 'assets'
})
export default class Asset extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  id!: string

  @Column(DataType.STRING(255))
  fileName!: string

  @Column(DataType.STRING(32))
  mimeType!: string

  @Column(DataType.STRING(12))
  streamId!: string

  @Column(DataType.STRING(16))
  deploymentId!: string

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date
}
