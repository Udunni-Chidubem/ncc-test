'use strict';
const {
  Model
} = require('sequelize');
const state = require('./state');
module.exports = (sequelize, DataTypes) => {
  class LGAs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LGAs.belongsTo(models.States, {
        foreignKey : 'state_id'
      })
    }
  }
  LGAs.init({
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    name:{ 
      type: DataTypes.STRING,
      allowNull: false}
  }, {
    unserscored :true,
    sequelize,
    tableName: 'lgas',
    modelName: 'LGAs',
  });
  return LGAs;
};