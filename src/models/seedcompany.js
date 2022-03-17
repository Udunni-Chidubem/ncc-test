'use strict';
const {
  Model
} = require('sequelize');
const user = require('./user');
module.exports = (sequelize, DataTypes) => {
  class SeedCompany extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SeedCompany.belongsTo(models.User)
    }
  }
  SeedCompany.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name_of_company: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone_no:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    tin: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    licensed_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    certification_number: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    licensed_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName : 'seedtrader',
    sequelize,
    modelName: 'SeedCompany',
  });
  return SeedCompany;
};