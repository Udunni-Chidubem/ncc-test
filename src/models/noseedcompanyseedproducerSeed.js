"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NoSeedCompanyseedProducerSeeds extends Model {
    static associate(models) {
      NoSeedCompanyseedProducerSeeds.belongsTo(
        models.NoSeedCompanySeedProducer,
        {
          foreignKey: "producer_id",
          targetKey: "id",
        }
      );
    }
  }
  NoSeedCompanyseedProducerSeeds.init(
    {
      name_of_seed: DataTypes.STRING,
      variety_of_seed: DataTypes.STRING,
      volume_of_seed: DataTypes.INTEGER,
      unit: DataTypes.STRING,
      year_produced: DataTypes.STRING,
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
      tableName: "NoSeedCompanyseedProducerSeeds",
      modelName: "NoSeedCompanyseedProducerSeeds",
    }
  );
  return NoSeedCompanyseedProducerSeeds;
};
