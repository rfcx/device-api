'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('GuardianMetaDiskUsage', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true
        },
        measured_at: {
          type: Sequelize.DATE(3),
          primaryKey: true
        },
        internal_bytes_available: {
          type: Sequelize.BIGINT,
          defaultValue: 0
        },
        internal_bytes_used: {
          type: Sequelize.BIGINT,
          defaultValue: 0
        },
        external_bytes_available: {
          type: Sequelize.BIGINT,
          defaultValue: 0
        },
        external_bytes_used: {
          type: Sequelize.BIGINT,
          defaultValue: 0
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
      await queryInterface.sequelize.query("SELECT create_hypertable('\"GuardianMetaDiskUsage\"', 'measured_at')", {
        type: queryInterface.sequelize.QueryTypes.RAW,
        transaction
      })
      await queryInterface.addIndex('GuardianMetaDiskUsage', ['guardian_id'], { transaction })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('GuardianMetaDiskUsage')
  }
}
