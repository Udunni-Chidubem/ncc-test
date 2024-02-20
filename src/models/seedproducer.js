'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SeedProducer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SeedProducer.belongsTo(models.User, {
        foreignKey : 'user_id'
      })
      SeedProducer.belongsTo(models.States, {
        foreignKey: 'state_id'
      })
      SeedProducer.belongsTo(models.LGAs, {
        foreignKey : 'lg_id'
      })
      SeedProducer.hasMany(models.SeedProducerSeed, {
        foreignKey : 'producer_id',
        sourceKey:'id'
      })
    }
  }
  SeedProducer.init({
    user_id: DataTypes.INTEGER,
    full_name: DataTypes.STRING,
    phone_no:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
    certified: DataTypes.STRING,
    // name_of_seed: DataTypes.STRING,
    // variety_of_seed: DataTypes.STRING,
    // volume_of_seed: DataTypes.INTEGER,
    // state_id: DataTypes.INTEGER,
    // lg_id: DataTypes.INTEGER,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    gender: DataTypes.STRING,
    age_range: DataTypes.STRING,
    living_status: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(new Date().getTime() + (1 * 60 * 60 * 1000))
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(new Date().getTime() + (1 * 60 * 60 * 1000))
    }
  }, {
    underscored : true,
    sequelize,
    timestamps: false,
    tableName: 'seedProducer',
    modelName: 'SeedProducer',
  });
  return SeedProducer;
};