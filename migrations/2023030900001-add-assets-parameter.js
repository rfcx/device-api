'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'assets',
      'asset_parameters',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('assets', 'asset_parameters')
  }
}
