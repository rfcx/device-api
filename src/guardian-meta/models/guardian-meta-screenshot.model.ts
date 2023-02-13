import { BelongsTo, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, IsDate, IsInt, Min, Default } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import Guardian from '../../guardians/guardian.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaScreenShots'
})
export class GuardianMetaScreenShot extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number

  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  guid!: string

  @IsDate
  @Column(DataType.DATE(3))
  capturedAt!: Date

  @Column(DataType.STRING)
  url!: string

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  size!: number

  @Column(DataType.STRING)
  sha1Checksum!: string

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaScreenShot])

export default GuardianMetaScreenShot
