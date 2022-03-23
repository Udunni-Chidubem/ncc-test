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
      Farmer.belongsTo(models.States, {
        foreignKey : 'state_id'
      })
      Farmer.belongsTo(models.LGAs, {
        foreignKey : 'lg_id'
      })
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
    account_no : DataTypes.STRING,
    nin: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    gender: DataTypes.STRING,
    state_id: DataTypes.STRING,
    lg_id: DataTypes.STRING,
    level_of_education: DataTypes.STRING,
    user_id: {
      type :DataTypes.INTEGER,
      unique : true
    }
  }, {
    underscored: true,
    tableName : 'farmer',
    sequelize,
    modelName: 'Farmer',
  });
  return Farmer;
};