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

      // Product.belongsTo(models.SeedCompany, {
      //   foreignKey: 'user_id'
      // })
    }
  }
  Product.init({
    user_id: DataTypes.INTEGER,
    product_name: DataTypes.STRING,
    variant: DataTypes.STRING,
    description: DataTypes.TEXT,
    item: DataTypes.STRING,
    file_name: DataTypes.STRING,
    local_name:DataTypes.STRING,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
  }, {
    underscored : true,
    sequelize,
    timestamps: false,
    tableName: 'product',
    modelName: 'Product',
  });
  return Product;
};