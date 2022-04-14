'use strict';
const {
  Model
} = require('sequelize');
const state = require('./lga');
module.exports = (sequelize, DataTypes) => {
  class States extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      States.hasMany(models.LGAs)
      States.hasMany(models.Farmer)
    }
  }
  States.init({  
    name:{ 
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    underscored : true,
    sequelize,
    tableName: 'states',
    modelName: 'States',
  });
  return States;
};