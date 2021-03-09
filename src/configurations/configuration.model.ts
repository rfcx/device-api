import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, DefaultScope } from 'sequelize-typescript'

@DefaultScope(() => ({
  attributes: ['id', 'bitrate', 'sampleRate', 'duration', 'fileFormat']
}))
@Table({
  paranoid: true,
  tableName: 'configurations',
  initialAutoIncrement: '0'
})
export default class Configuration extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number

  @Column(DataType.INTEGER)
  bitrate!: number

  @Column(DataType.INTEGER)
  sampleRate!: number

  @Column(DataType.INTEGER)
  duration!: number

  @Column(DataType.STRING(16))
  fileFormat!: string
}
