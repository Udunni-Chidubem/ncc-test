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
      User_role.belongsTo(user)
      User_role.belongsTo(role)
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
    sequelize,
    modelName: 'User_role',
  });
  return User_role;
};