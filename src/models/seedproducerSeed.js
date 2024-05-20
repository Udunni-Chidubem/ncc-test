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
      unit: DataTypes.STRING,
      year_produced: DataTypes.STRING,
      amount_of_seed: DataTypes.INTEGER,
      amount_of_seed_remitted: DataTypes.INTEGER,
      amount_of_seed_to_be_remitted: DataTypes.INTEGER,
      unit_for_total_amount_of_seed_given: DataTypes.STRING,
      unit_for_total_amount_of_seed_remitted: DataTypes.STRING,
      unit_for_total_amount_of_seed_to_be_remitted: DataTypes.STRING,
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
