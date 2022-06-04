'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.User, {
        foreignKey : 'from_user',
        targetKey : 'id',
        as : 'Sender'
      }),
      Message.belongsTo(models.User, {
        as : 'Recipient',
        foreignKey:'to_user',
        targetKey : 'id'
      })
    }
  }
  Message.init({
    from_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    to_user: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
  }, {
    underscored : true,
    sequelize,
    timestamps: false,
    modelName: 'Message',
    tableName : 'messages'
  });
  return Message;
};