'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('guardian_log', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
        guardian_id: {
            type: Sequelize.STRING(12),
            allowNull: false
        },
        type: {
            type: Sequelize.STRING(12),
            allowNull: false
        },
        body: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('guardian_log')
  }
}
