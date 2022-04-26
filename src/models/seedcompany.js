'use strict';
const {
  Model
} = require('sequelize');
const user = require('./user');
module.exports = (sequelize, DataTypes) => {
  class SeedCompany extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SeedCompany.belongsTo(models.User)
      SeedCompany.hasMany(models.Product, {
        foreignKey: 'user_id'
      })
      SeedCompany.belongsTo(models.States, {
        foreignKey: 'state_id'
      })
      SeedCompany.belongsTo(models.LGAs, {
        foreignKey : 'lg_id'
      })
      SeedCompany.hasMany(models.Orders, {
        foreignKey : 'company_id'
      })
    }
  }
  SeedCompany.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name_of_company: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone_no:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    tin: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    email: {
      type: DataTypes.STRING(65),
      allowNull: true,
      unique: true
    },
    licensed_no: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    certification_number: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    licensed_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    state_id: DataTypes.INTEGER,
    lg_id: DataTypes.INTEGER,
    bank_account_name:DataTypes.STRING,
    bank_account_no:DataTypes.STRING,
    bank_code : DataTypes.STRING,
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
    tableName : 'seedcompany',
    sequelize,
    timestamps: false,
    modelName: 'SeedCompany',
  });
  return SeedCompany;
};