module.exports = function (sequelize, DataTypes) {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_by_id: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false
  })

  Project.associate = function(models) {
    Project.belongTo(models.User, { as: 'created_by', foreignKey: 'created_by_id' })
  }
 
  Project.attributes = {
    full: ['id', 'name', 'color', 'created_by_id'],
    lite: ['name', 'color']
  }

  return Project
}
