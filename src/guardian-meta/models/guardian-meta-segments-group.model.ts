import { BelongsTo, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, Min, IsInt } from 'sequelize-typescript'
import db from '../../common/db/guardian'
import Guardian from '../../guardians/guardian.model'

@Table({
  paranoid: false,
  tableName: 'GuardianMetaSegmentsGroups'
})
export default class GuardianMetaSegmentsGroup extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number

  @Column(DataType.STRING)
  guid!: string

  @IsInt
  @Min(0)
  @Column(DataType.INTEGER)
  segmentCount!: number

  @Column(DataType.STRING)
  protocol!: string

  @Column(DataType.STRING)
  type!: string

  @Column(DataType.STRING)
  checksumSnippet!: string

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @BelongsTo(() => Guardian, 'guardianId')
  guardian!: Guardian
}

db.sequelize.addModels([GuardianMetaSegmentsGroup])
