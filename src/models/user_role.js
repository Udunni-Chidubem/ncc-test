'use strict';
const {
  Model
} = require('sequelize');
const role = require('./role');
const user = require('./user');
module.exports = (sequelize, DataTypes) => {
  class User_role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_role.belongsTo(models.User)
      User_role.belongsTo(models.Role)
    }
  }
  User_role.init({
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
    modelName: 'User_role',
  });
  return User_role;
};