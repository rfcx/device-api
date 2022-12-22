import { Table, Column, Model, DataType } from 'sequelize-typescript'
import db from '../common/db/device'

@Table({
  timestamps: false,
  tableName: 'guardian_log'
})
class GuardianLog extends Model {
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
db.sequelize.addModels([GuardianLog])

export default GuardianLog
