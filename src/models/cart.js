'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.hasOne(models.User, {
        foreignKey: 'id'
      })

      Cart.hasOne(models.Product, {
        foreignKey: 'id'
      })
    }
  }
  Cart.init({
    farmer_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    unit_price: DataTypes.STRING,
    size: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    total_amount: DataTypes.STRING,
    status: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
  }, {
    underscored: true,
    tableName : 'cart',
    sequelize,
    timestamps: false,
    modelName: 'Cart',
  });
  return Cart;
};