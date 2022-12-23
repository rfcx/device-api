'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'assets',
      'deleted_at',
      {
        type: Sequelize.DATE,
        allowNull: true
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('assets', 'deleted_at')
  }
}
