'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionCarts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        TransactionCarts.belongsTo(models.Cart, {
            foreignKey : 'cart_id'
        })
        TransactionCarts.belongsTo(models.TransactionLog,{
            foreignKey : 'transaction_log_id'
        })
    }
}
  TransactionCarts.init({
    cart_id : DataTypes.INTEGER,
    transaction_log_id:DataTypes.INTEGER,
    created_at : DataTypes.DATE,
    updated_at : DataTypes.DATE,
  }, {
    underscored : true,
    sequelize,
    modelName: 'TransactionCarts',
    tableName : 'transaction_carts'
  });
  return TransactionCarts;
};