'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'deployments',
      'guid',
      {
        type: Sequelize.STRING(12),
        allowNull: true
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('deployments', 'guid')
  }
}