"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SeedProducerSeed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SeedProducerSeed.belongsTo(models.SeedProducer, {
        foreignKey: "producer_id",
        targetKey: "id",
      });
    }
  }
  SeedProducerSeed.init(
    {
      // certified: DataTypes.STRING,
      name_of_seed: DataTypes.STRING,
      variety_of_seed: DataTypes.STRING,
      volume_of_seed: DataTypes.INTEGER,
      // state_id: DataTypes.INTEGER,
      // lg_id: DataTypes.INTEGER,
      // status: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 1
      // },
      // gender: DataTypes.STRING,
      // age_range: DataTypes.STRING,
      // living_status: DataTypes.STRING,
      unit: DataTypes.STRING,
      year_produced: DataTypes.STRING,
      amount_of_seed: DataTypes.INTEGER,
      amount_of_seed_remitted: DataTypes.INTEGER,
      amount_of_seed_to_be_remitted: DataTypes.INTEGER,
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
      underscored: true,
      sequelize,
      timestamps: false,
      tableName: "seedProducerSeeds",
      modelName: "SeedProducerSeed",
    }
  );
  return SeedProducerSeed;
};
