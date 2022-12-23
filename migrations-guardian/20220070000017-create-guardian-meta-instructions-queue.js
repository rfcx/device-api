'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('GuardianMetaInstructionsQueue', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        queued_at: {
          type: Sequelize.DATE(3),
          allowNull: true
        },
        execute_at: {
          type: Sequelize.DATE(3),
          allowNull: true
        },
        type: {
          type: Sequelize.STRING,
          allowNull: true
        },
        command: {
          type: Sequelize.STRING,
          allowNull: true
        },
        meta_json: {
          type: Sequelize.STRING,
          allowNull: true
        },
        dispatch_attempts: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        received_at: {
          type: Sequelize.DATE(3),
          allowNull: true
        },
        guardian_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: {
              tableName: 'Guardians'
            },
            key: 'id'
          }
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        }
      }, { transaction })
      await queryInterface.addIndex('GuardianMetaInstructionsQueue', ['guardian_id'], { transaction })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('GuardianMetaInstructionsQueue')
  }
}
