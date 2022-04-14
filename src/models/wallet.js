'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        Wallet.belongsTo(models.User, {
            foreignKey : 'user_id'
        })
    }
  }
  Wallet.init({
    user_id : DataTypes.INTEGER,
    amount : DataTypes.DOUBLE,
    created_at : DataTypes.DATE,
    updated_at : DataTypes.DATE,
  }, {
    underscored : true,
    sequelize,
    modelName: 'Wallet',
    tableName : 'wallet'
  });
  return Wallet;
};