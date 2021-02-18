'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('assets', {
      file_name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      stream_id: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('assets')
  }
}
