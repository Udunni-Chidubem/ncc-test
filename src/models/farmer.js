'use strict';
const {
  Model
} = require('sequelize');
const User = require('./user');
module.exports = (sequelize, DataTypes) => {
  class Farmer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      Farmer.belongsTo(models.User)
    }
  }

  
  Farmer.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    othername: DataTypes.STRING,
    product_farmed: DataTypes.STRING,
    location_of_farm: DataTypes.STRING,
    size_of_farm: DataTypes.STRING,
    phone_no: DataTypes.STRING,
    bvn: DataTypes.STRING,
    account_name: DataTypes.STRING,
    nin: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    level_of_education: DataTypes.STRING,
    user_id: {
      type :DataTypes.INTEGER,
      unique : true
    }
  }, {
    tableName : 'farmer',
    sequelize,
    modelName: 'Farmer',
  });
  return Farmer;
};