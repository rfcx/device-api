const Umzug = require('umzug')
const db = require('../dist/common/db')
const path = require('path')
const { Sequelize } = require('sequelize')

const umzug = new Umzug({
  migrations: {
    path: path.join(__dirname, '../migrations'),
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
})

;(async () => {
  await umzug.up()
  console.log('All migrations performed successfully')
})()
