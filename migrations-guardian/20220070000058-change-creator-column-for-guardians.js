'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeConstraint('Guardians', 'Guardians_creator_fkey')
    } catch (e) {
      console.log('Guardians_creator_fkey does not exist')
    }
    await queryInterface.changeColumn('Guardians', 'creator', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Guardians', 'creator', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'Users'
        },
        key: 'id'
      }
    })
  }
}
