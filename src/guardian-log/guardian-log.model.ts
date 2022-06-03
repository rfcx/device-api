import { Table, Column, Model, DataType } from 'sequelize-typescript'

@Table({
  timestamps: false,
  tableName: 'guardian_log'
})
export default class GuardianLog extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id!: Number

  @Column(DataType.STRING(12))
  guardianId!: string

  @Column(DataType.STRING(12))
  type!: string

  @Column(DataType.STRING)
  body!: string
}
