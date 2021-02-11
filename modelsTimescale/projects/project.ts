module.exports = function (sequelize: any, DataTypes: any) {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.STRING(12),
      allowNull: false,
      primaryKey: true
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

  Project.associate = function(models: any) {
    Project.belongsTo(models.User, { as: 'created_by', foreignKey: 'created_by_id' })
    Project.hasMany(models.Stream, { as: 'streams', foreignKey: 'project_id' })
  }
 
  Project.attributes = {
    full: ['id', 'name', 'color', 'created_by_id'],
    lite: ['id', 'name', 'color']
  }

  Project.include = function (as = 'project', attributes = Project.attributes.lite, required = true) {
    return { model: Project, as, attributes, required }
  }

  return Project
}
