'use strict';
const {
  Model
} = require('sequelize');
const state = require('./lga');
module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      State.hasMany(models.Lga)
    }
  }
  State.init({  
    name:{ 
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'state',
    modelName: 'State',
  });
  return State;
};