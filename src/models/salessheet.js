"use strict";
const { Model } = require("sequelize");
const User = require("./user");
module.exports = (sequelize, DataTypes) => {
  class Salesheets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      Salesheets.belongsTo(models.States, {
        foreignKey: "state_id",
      }),
        Salesheets.belongsTo(models.LGAs, {
          foreignKey: "lg_id",
        }),
        Salesheets.belongsTo(models.User, {
          foreignKey: "user_id",
          targetKey: "id",
        });
    }
  }

  Salesheets.init(
    {
      customer_name: DataTypes.STRING,
      customer_number: DataTypes.TEXT,
      product_name: DataTypes.JSON,
      product_variant: DataTypes.JSON,
      quantity: DataTypes.JSON,
      size: DataTypes.JSON,
      product_cost: DataTypes.JSON,
      sale_date: DataTypes.DATE,
      state_id: DataTypes.INTEGER,
      lg_id: DataTypes.INTEGER,
      community: DataTypes.STRING(55),
      user_id: DataTypes.INTEGER,
      date_sold: DataTypes.DATE,
    },
    {
      underscored: true,
      tableName: "salesheets",
      sequelize,
      modelName: "Salesheets",
    }
  );
  return Salesheets;
};
