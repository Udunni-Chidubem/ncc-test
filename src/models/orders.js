'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Orders.belongsTo(models.SeedCompany, {
            foreignKey : 'company_id'
        })
        Orders.belongsTo(models.TransactionLog,{
            foreignKey : 'transaction_log_id'
        })
    }
}
  Orders.init({
    company_id : DataTypes.INTEGER,
    transaction_log_id:DataTypes.INTEGER,
    status : DataTypes.STRING,
    created_at : DataTypes.DATE,
    updated_at : DataTypes.DATE,
  }, {
    underscored : true,
    sequelize,
    modelName: 'Orders',
    tableName : 'orders'
  });
  return Orders;
};