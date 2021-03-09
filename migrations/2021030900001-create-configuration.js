'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('configurations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      bitrate: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sample_rate: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      file_format: {
        type: Sequelize.STRING(16),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('configurations')
  }
}
