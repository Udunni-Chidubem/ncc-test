"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NoSeedCompanySeedProducer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      NoSeedCompanySeedProducer.belongsTo(models.States, {
        foreignKey: "state_id",
      });
      NoSeedCompanySeedProducer.belongsTo(models.LGAs, {
        foreignKey: "lg_id",
      });
      NoSeedCompanySeedProducer.hasMany(models.NoSeedCompanyseedProducerSeeds, {
        foreignKey: "producer_id",
        sourceKey: "id",
      });
    }
  }
  NoSeedCompanySeedProducer.init(
    {
      // user_id: DataTypes.INTEGER,
      full_name: DataTypes.STRING,
      phone_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      certified: DataTypes.STRING,
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      gender: DataTypes.STRING,
      age_range: DataTypes.STRING,
      living_status: DataTypes.STRING,
      created_at: {
        type: DataTypes.DATE,
        defaultValue: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
      },
    },
    {
      underscored: true,
      sequelize,
      timestamps: false,
      tableName: "noSeedCompanySeedProducer",
      modelName: "NoSeedCompanySeedProducer",
    }
  );
  return NoSeedCompanySeedProducer;
};
