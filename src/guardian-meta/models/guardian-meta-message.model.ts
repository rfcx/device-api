import { BelongsTo, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, Min, IsInt, Default } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import Guardian from '../../guardians/guardian.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaMessages'
})
export default class GuardianMetaMessage extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  guid!: string

  @Column(DataType.DATE(3))
  receivedAt!: Date

  @Column(DataType.DATE(3))
  sentAt!: Date

  @Column(DataType.STRING)
  address!: string

  @Column(DataType.TEXT)
  body!: string

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  androidId!: string

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaMessage])
