module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    name: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false
  })
 
  User.attributes = {
    full: ['id', 'name', 'email'],
    lite: ['name', 'email']
  }

  return User
}
