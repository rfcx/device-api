'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'assets',
      'meta',
      {
        type: Sequelize.JSON,
        allowNull: true
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('assets', 'meta')
  }
}
