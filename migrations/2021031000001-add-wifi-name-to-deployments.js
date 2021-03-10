'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'deployments',
      'wifi',
      {
        type: Sequelize.STRING(255),
        allowNull: true
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('deployments', 'wifi')
  }
}
