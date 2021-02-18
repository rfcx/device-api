import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript'

@Table({
  paranoid: false,
  tableName: 'assets'
})
export default class Asset extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  fileName!: string

  @Column(DataType.STRING(12))
  streamId!: string
}
