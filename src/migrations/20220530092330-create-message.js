'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      from_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      message: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false
      },
      to_user: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('messages');
  }
};