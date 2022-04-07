'use strict';
const {
  Model
} = require('sequelize');
const role = require('./role');
const user = require('./user');
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserRole.belongsTo(models.User)
      UserRole.belongsTo(models.Role)
    }
  }
  UserRole.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    role_id:{
      type: DataTypes.INTEGER,
      allowNull: false
  }
  }, {
    underscored: true,
    tableName : 'user_role',
    sequelize,
    modelName: 'UserRole',
  });
  return UserRole;
};