'use strict';
const {
  Model
} = require('sequelize');
const user = require('./user');
module.exports = (sequelize, DataTypes) => {
  class SeedTrader extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SeedTrader.belongsTo(models.User)
      SeedTrader.belongsTo(models.States, {
        foreignKey: 'state_id'
      })
      SeedTrader.belongsTo(models.LGAs, {
        foreignKey : 'lg_id'
      })
    }
  }
  SeedTrader.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    othername: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location_of_seed: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    lg_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    phone_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    unique_no: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    bvn: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    nin: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    age: {
      type: DataTypes.STRING,
      allowNull: true
    },
    referal_code : {
      type : DataTypes.STRING,
      allowNull : false,
      unique : true
    }
  }, {
    underscored: true,
    tableName : 'seedtrader',
    sequelize,
    modelName: 'SeedTrader',
  });
  return SeedTrader;
};