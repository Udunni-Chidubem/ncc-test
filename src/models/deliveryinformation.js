'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeliveryInformation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DeliveryInformation.belongsTo(models.User, {
        foreignKey : 'user_id'
      })

      DeliveryInformation.belongsTo(models.States, {
        foreignKey : 'state_id'
      })
      DeliveryInformation.belongsTo(models.LGAs, {
        foreignKey : 'lg_id'
      })
    }
  }
  DeliveryInformation.init({
    user_id: {
      type :DataTypes.INTEGER,
      unique : true
    },
    state_id: DataTypes.INTEGER,
    lg_id: DataTypes.INTEGER,
    address: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    tableName : 'delivery_information',
    modelName: 'DeliveryInformation',
  });
  return DeliveryInformation;
};