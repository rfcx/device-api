'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deployments', {
      id: {
        type: Sequelize.STRING(16),
        allowNull: false,
        primaryKey: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deployed_at: {
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
      },
      deployment_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      created_by_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      stream_id: {
        type: Sequelize.STRING,
        allowNull: false
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('deployments')
  }
}