'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('streams', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      longiitude: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      altiitude: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      created_by_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id'
        }
      },
      project_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: {
            tableName: 'projects'
          },
          key: 'id'
        }
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('streams')
  }
}
