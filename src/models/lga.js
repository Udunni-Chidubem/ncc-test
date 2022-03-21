'use strict';
const {
  Model
} = require('sequelize');
const state = require('./state');
module.exports = (sequelize, DataTypes) => {
  class Lga extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Lga.belongsTo(models.State)
    }
  }
  Lga.init({
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    name:{ 
      type: DataTypes.STRING,
      allowNull: false}
  }, {
    sequelize,
    tableName: 'lga',
    modelName: 'Lga',
  });
  return Lga;
};