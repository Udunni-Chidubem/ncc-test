"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class KnowledgeBase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //   DeliveryInformation.belongsTo(models.User, {
      //     foreignKey: "user_id",
      //   });
      //   DeliveryInformation.belongsTo(models.States, {
      //     foreignKey: "state_id",
      //   });
      //   DeliveryInformation.belongsTo(models.LGAs, {
      //     foreignKey: "lg_id",
      //   });
    }
  }
  KnowledgeBase.init(
    {
      name: DataTypes.TEXT,
      description: DataTypes.TEXT,
      image_path: DataTypes.TEXT,
      file_path: DataTypes.TEXT,
      created_at: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      underscored: true,
      timestamps: false,
      tableName: "knowledge_base",
      modelName: "KnowledgeBase",
    }
  );
  return KnowledgeBase;
};
