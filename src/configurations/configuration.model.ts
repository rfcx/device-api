import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript'

@Table({
  paranoid: true,
  tableName: 'configurations'
})
export default class Configuration extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number

  @Column(DataType.INTEGER)
  bitrate!: number

  @Column(DataType.INTEGER)
  sample_rate!: number

  @Column(DataType.INTEGER)
  duration!: number

  @Column(DataType.STRING(16))
  file_format!: string
}
