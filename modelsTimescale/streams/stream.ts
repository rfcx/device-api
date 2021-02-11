module.exports = function (sequelize: any, DataTypes: any) {
  const Stream = sequelize.define('Stream', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    longiitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    altiitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    created_by_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    project_id: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    timestamps: false
  })

  Stream.associate = function(models: any) {
    Stream.belongsTo(models.User, { as: 'created_by', foreignKey: 'created_by_id' })
    Stream.belongsTo(models.Project, { as: 'project', foreignKey: 'project_id' })
  }
 
  Stream.attributes = {
    full: ['id', 'name', 'latitude', 'longitude', 'altitude', 'created_by_id', 'project_id'],
    lite: ['name', 'latitude', 'longitude', 'altitude']
  }

  return Stream
}
