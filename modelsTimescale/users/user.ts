
module.exports = function (sequelize: any, DataTypes : any) {
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

  User.include = function (as = 'user', attributes = User.attributes.lite, required = true) {
    return { model: User, as, attributes, required }
  }

  return User
}
