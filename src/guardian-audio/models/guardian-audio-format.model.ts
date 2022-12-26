import { AllowNull, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, Default, IsInt, Min, Max } from 'sequelize-typescript'
import db from '../../common/db/guardian'

@Table({
  paranoid: false,
  tableName: 'GuardianAudioFormats'
})
export default class GuardianAudioFormat extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  codec!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  mime!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  fileExtension!: string

  @AllowNull(false)
  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  sampleRate!: number

  @AllowNull(false)
  @IsInt
  @Min(0)
  @Max(64)
  @Default(0)
  @Column(DataType.INTEGER)
  sampleSize!: number

  @AllowNull(false)
  @IsInt
  @Min(0)
  @Max(16)
  @Default(1)
  @Column(DataType.INTEGER)
  channelCount!: number

  @AllowNull(false)
  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  targetBitRate!: number

  @Default(false)
  @Column(DataType.BOOLEAN)
  isVbr!: boolean

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date
}

db.sequelize.addModels([GuardianAudioFormat])
