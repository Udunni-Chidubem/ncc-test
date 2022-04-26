'use strict';
const {
  Model
} = require('sequelize');
const User = require('./user');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      Contact.belongsTo(models.User)
      Contact.belongsTo(models.States, {
        foreignKey : 'state_id'
      })
      Contact.belongsTo(models.LGAs, {
        foreignKey : 'lg_id'
      })
    }
  }

  Contact.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email : DataTypes.STRING,
    phone : DataTypes.STRING,
    message : DataTypes.TEXT,
    created_at : DataTypes.DATE,
    updated_at : DataTypes.DATE
  }, {
    underscored: true,
    tableName : 'contact',
    sequelize,
    modelName: 'Contact',
  });
  return Contact;
};