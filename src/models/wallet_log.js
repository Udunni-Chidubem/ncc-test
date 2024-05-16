'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class walletLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      walletLog.belongsTo(models.SeedCompany, {
        foreignKey: 'company_id'
      })

      walletLog.belongsTo(models.Wallet, {
        foreignKey: 'wallet_id'
      })

      walletLog.belongsTo(models.User, {
        foreignKey: 'user_id'
      })

    }
  }
  
  walletLog.init({
    user_id: DataTypes.INTEGER,
    transaction_ref: DataTypes.STRING,
    linkingreference: DataTypes.STRING,
    externalreference: DataTypes.STRING,
    company_id: DataTypes.INTEGER,
    description: DataTypes.STRING,
    external_message: DataTypes.STRING,
    amount: DataTypes.DOUBLE,
    account_no: DataTypes.STRING,
    currency: DataTypes.STRING,
    external_date: DataTypes.DATE,
    state: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    underscored: true,
    tableName : 'wallet_logs',
    sequelize,
    timestamps: false,
    modelName: 'WalletLog',

  });
  return walletLog;
};