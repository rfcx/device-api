'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deployments', {
      id: {
        type: Sequelize.STRING(16),
        allowNull: false,
        primaryKey: true
      },
      stream_id: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      deployed_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deployment_type: {
        type: Sequelize.STRING(16),
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      created_by_id: {
        type: Sequelize.STRING(36),
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
    return queryInterface.dropTable('deployments')
  }
}
