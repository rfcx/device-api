const Umzug = require('umzug')
const dbDevice = require('../dist/common/db/device')
const dbGuardian = require('../dist/common/db/guardian')
const path = require('path')
const { Sequelize } = require('sequelize')

function getConfig (type) {
  const db = type === 'device' ? dbDevice : dbGuardian
  return {
    migrations: {
      path: path.join(__dirname, `../migrations-${type}`),
      pattern: /\.js$/,
      params: [
        db.default.sequelize.getQueryInterface(),
        Sequelize
      ]
    },
    storage: 'sequelize',
    storageOptions: {
      sequelize: db.default.sequelize,
      tableName: 'migrations',
      schema: 'sequelize'
    }
  }
}

const umzugDevice = new Umzug(getConfig('device'))
const umzugGuardian = new Umzug(getConfig('guardian'))

;(async () => {
  await umzugDevice.up()
  console.log('Device database migrations performed successfully')
  await umzugGuardian.up()
  console.log('Guardian database migrations performed successfully')
})()
