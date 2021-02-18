import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript'

@Table({
  timestamps: false,
  paranoid: false,
  tableName: 'assets'
})
export default class Asset extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  fileName!: string
}
