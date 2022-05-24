'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        TransactionLog.belongsTo(models.Farmer, {
            foreignKey : 'farmer_id'
        })
        TransactionLog.belongsTo(models.SeedTrader, {
            foreignKey : 'sseedtrader_id'
        })
        TransactionLog.belongsTo(models.SeedCompany,{
            foreignKey : 'company_id'
        })
        TransactionLog.hasMany(models.TransactionCarts, {
          foreignKey : 'transaction_log_id'
        })
    }
  }
  TransactionLog.init({
    farmer_id : DataTypes.INTEGER,
    company_id : DataTypes.INTEGER,
    description : DataTypes.TEXT,
    transaction_ref:DataTypes.STRING,
    amount : DataTypes.DOUBLE,
    status : DataTypes.STRING,
    created_at : DataTypes.DATE,
    currency : DataTypes.STRING,
    updated_at : DataTypes.DATE,
    transaction_id:DataTypes.STRING,
    pickup_point : DataTypes.TEXT
  }, {
    underscored : true,
    sequelize,
    modelName: 'TransactionLog',
    tableName : 'transaction_log'
  });
  return TransactionLog;
};