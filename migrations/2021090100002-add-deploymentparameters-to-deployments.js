'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'deployments',
      'deployment_parameters',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('deployments', 'deployment_parameters')
  }
}