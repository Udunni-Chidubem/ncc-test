'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.User, {
        foreignKey : 'user_id'
      })
    }
  }
  Product.init({
    user_id: DataTypes.INTEGER,
    product_name: DataTypes.STRING,
    variant: DataTypes.STRING,
    description: DataTypes.TEXT,
    item: DataTypes.STRING,
    file_name: DataTypes.STRING
  }, {
    underscored : true,
    sequelize,
    tableName: 'product',
    modelName: 'Product',
  });
  return Product;
};