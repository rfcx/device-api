'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'deployments',
      'configuration_id',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'configurations'
          },
          key: 'id'
        }
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('deployments', 'configuration_id')
  }
}
