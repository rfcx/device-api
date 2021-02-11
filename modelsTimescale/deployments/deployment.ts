module.exports = function (sequelize: any, DataTypes: any) {
  const Deployment = sequelize.define('Deployment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deployed_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deployment_key: {
      type: DataTypes.DATE,
      allowNull: false
    },
    device: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    created_by_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stream_id: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false
  })

  Deployment.associate = function(models: any) {
    Deployment.belongsTo(models.User, { as: 'created_by', foreignKey: 'created_by_id' })
    Deployment.belongsTo(models.Stream, { as: 'srream', foreignKey: 'stream_id' })
  }
 
  Deployment.attributes = {
    full: ['id', 'created_at', 'deployed_at', 'updated_at', 'deleted_at', 'deployment_key', 'device', 'is_active', 'created_by_id', 'stream_id'],
    lite: ['deployment_key', 'device', 'is_active']
  }

  return Deployment
}
