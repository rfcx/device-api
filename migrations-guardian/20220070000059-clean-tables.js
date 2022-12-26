'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn('GuardianSites', 'is_analyzable', { transaction })
      await queryInterface.removeColumn('Guardians', 'is_certified', { transaction })
      await queryInterface.removeColumn('Guardians', 'cartodb_coverage_id', { transaction })
      await queryInterface.removeColumn('Guardians', 'check_in_count', { transaction })
      await queryInterface.removeColumn('Guardians', 'last_update_check_in', { transaction })
      await queryInterface.removeColumn('Guardians', 'update_check_in_count', { transaction })
      await queryInterface.removeColumn('Guardians', 'prefs_audio_capture_interval', { transaction })
      await queryInterface.removeColumn('Guardians', 'prefs_service_monitor_interval', { transaction })
      await queryInterface.removeColumn('Guardians', 'notes', { transaction })
      await queryInterface.addColumn('Guardians', 'altitude', { type: Sequelize.DOUBLE, allowNull: true }, { transaction })

      await queryInterface.removeColumn('GuardianCheckIns', 'timezone_offset_minutes', { transaction })
      await queryInterface.removeColumn('GuardianCheckIns', 'is_certified', { transaction })

      await queryInterface.removeColumn('GuardianMetaBattery', 'is_fully_charged', { transaction })

      await queryInterface.removeColumn('GuardianAudio', 'measured_at_local', { transaction })
      await queryInterface.removeColumn('GuardianAudio', 'analyzed_at', { transaction })
      await queryInterface.removeColumn('GuardianAudio', 'analysis_queued_at', { transaction })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn('GuardianSites', 'is_analyzable', { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: true }, { transaction })
      await queryInterface.addColumn('Guardians', 'is_certified', { type: Sequelize.BOOLEAN, defaultValue: false }, { transaction })
      await queryInterface.addColumn('Guardians', 'cartodb_coverage_id', { type: Sequelize.UUID, unique: false, allowNull: true }, { transaction })
      await queryInterface.addColumn('Guardians', 'check_in_count', { type: Sequelize.INTEGER, defaultValue: 0 }, { transaction })
      await queryInterface.addColumn('Guardians', 'last_update_check_in', { type: Sequelize.DATE(3), defaultValue: Sequelize.NOW }, { transaction })
      await queryInterface.addColumn('Guardians', 'update_check_in_count', { type: Sequelize.INTEGER, defaultValue: 0 }, { transaction })
      await queryInterface.addColumn('Guardians', 'prefs_audio_capture_interval', { type: Sequelize.INTEGER, allowNull: true, defaultValue: null }, { transaction })
      await queryInterface.addColumn('Guardians', 'prefs_service_monitor_interval', { type: Sequelize.INTEGER, allowNull: true, defaultValue: null }, { transaction })
      await queryInterface.addColumn('Guardians', 'notes', { type: Sequelize.STRING, allowNull: true, unique: false }, { transaction })
      await queryInterface.removeColumn('Guardians', 'altitude', { transaction })

      await queryInterface.addColumn('GuardianCheckIns', 'timezone_offset_minutes', { type: Sequelize.INTEGER, allowNull: true }, { transaction })
      await queryInterface.addColumn('GuardianCheckIns', 'is_certified', { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: true }, { transaction })

      await queryInterface.addColumn('GuardianMetaBattery', 'is_fully_charged', { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: true }, { transaction })

      await queryInterface.addColumn('GuardianAudio', 'measured_at_local', { type: Sequelize.DATE(3), allowNull: true }, { transaction })
      await queryInterface.addColumn('GuardianAudio', 'analyzed_at', { type: Sequelize.DATE(3), allowNull: true }, { transaction })
      await queryInterface.addColumn('GuardianAudio', 'analysis_queued_at', { type: Sequelize.DATE(3), allowNull: true }, { transaction })
    })
  }
}
