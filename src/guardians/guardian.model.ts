import { AllowNull, Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, Unique, Default, IsFloat, Is, IsDate, Sequelize } from 'sequelize-typescript'
import db from '../common/db/guardian'

@Table({
  paranoid: false,
  tableName: 'Guardians'
})
export default class Guardian extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: string

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  guid!: string

  @Unique
  @Column(DataType.STRING)
  shortname!: string

  @Default(false)
  @Column(DataType.BOOLEAN)
  is_visible!: boolean

  @Column(DataType.STRING)
  phone_number!: string

  @Column(DataType.STRING)
  carrier_name!: string

  @Column(DataType.STRING)
  sim_card_id!: string

  @Default(false)
  @Column(DataType.BOOLEAN)
  is_updatable!: boolean

  @IsFloat
  @Is('latitude', (value: number) => {
    if (value < -90 || value > 90) {
      throw new Error(`Latitude should be between -90 and 90. Currently ${value}`)
    }
  })
  @Column(DataType.DOUBLE)
  latitude!: number

  @IsFloat
  @Is('longitude', (value: number) => {
    if (value < -180 || value > 180) {
      throw new Error(`Longitude should be between -180 and 180. Currently ${value}`)
    }
  })
  @Column(DataType.DOUBLE)
  longitude!: number

  @IsFloat
  @Column(DataType.DOUBLE)
  altitude!: number

  @IsDate
  @Default(Sequelize.fn('NOW'))
  @Column(DataType.DATE)
  last_check_in!: Date

  @Unique
  @Column(DataType.STRING)
  auth_token_salt!: string

  @Unique
  @Column(DataType.STRING)
  auth_token_hash!: string

  @IsDate
  @Default(Sequelize.fn('NOW'))
  @Column(DataType.DATE(3))
  auth_token_updated_at!: Date

  @IsDate
  @Default(Sequelize.fn('NOW'))
  @Column(DataType.DATE(3))
  auth_token_expires_at!: Date

  @Column(DataType.STRING)
  auth_pin_code!: string

  @Default(false)
  @Column(DataType.BOOLEAN)
  is_private!: boolean

  @Column(DataType.STRING(12))
  stream_id!: string

  @Column(DataType.STRING(12))
  project_id!: string

  @Column(DataType.STRING)
  creator!: string

  @Column(DataType.STRING(255))
  timezone!: string

  @IsDate
  @Column(DataType.DATE(3))
  last_deployed!: Date

  @IsDate
  @Column(DataType.DATE(3))
  last_ping!: Date

  @IsDate
  @Column(DataType.DATE(3))
  last_audio_sync!: Date

  @IsDate
  @Column(DataType.DATE(3))
  last_battery_main!: Date

  @IsDate
  @Column(DataType.DATE(3))
  last_battery_internal!: Date

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date
}

db.sequelize.addModels([Guardian])
