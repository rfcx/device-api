'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'deployments',
      'device_parameters',
      {
        type: Sequelize.TEXT
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
        'deployments',
        'device_parameters',
        {
          type: Sequelize.STRING(255)
        }
      )
  }
}
