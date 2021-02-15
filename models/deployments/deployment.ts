module.exports = function (sequelize: any, DataTypes: any) {
  const Deployment = sequelize.define('Deployment', {
    id: {
      type: DataTypes.STRING(16),
      allowNull: false,
      primaryKey: true
    },
    deployed_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deployment_type: {
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
    timestamps: true,
    paranoid: true
  })
 
  Deployment.attributes = {
    full: ['id', 'created_at', 'deployed_at', 'updated_at', 'deleted_at', 'deployment_type', 'is_active', 'created_by_id', 'stream_id'],
    lite: ['id', 'device', 'is_active']
  }

  return Deployment
}
