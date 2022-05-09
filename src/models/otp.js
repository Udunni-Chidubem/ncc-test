'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Otp.init({
    user_id:{ 
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    otp_code: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    }
  }, {
    underscored: true,
    tableName : 'otp',
    sequelize,
    modelName: 'Otp',
  });
  return Otp;
};