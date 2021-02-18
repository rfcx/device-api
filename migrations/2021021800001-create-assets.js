'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('assets', {
      file_name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('assets')
  }
}
