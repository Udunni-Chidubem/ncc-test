'use strict';
const {
  Model
} = require('sequelize');
const farmer = require('./farmer');
const seedcompany = require('./seedcompany');
const seedtrader = require('./seedtrader');
const user_role = require('./user_role');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.User_role)
      User.hasOne(models.Farmer)
      User.hasOne(models.SeedTrader)
      User.hasOne(models.SeedCompany)
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName : 'user',
    sequelize,
    modelName: 'User',
  });
  return User;
};