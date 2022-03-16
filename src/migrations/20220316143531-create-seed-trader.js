'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SeedTrader', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      firstname: {
        type: Sequelize.STRING(55),
        allowNull: false
      },
      lastname: {
        type: Sequelize.STRING(55),
        allowNull: false
      },
      othername: {
        type: Sequelize.STRING(55)
      },
      location_of_seed: {
        type: Sequelize.STRING(65),
        allowNull: false
      },
      phone_no: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      unique_no: {
        type: Sequelize.STRING(30)
      },
      bvn: {
        type: Sequelize.STRING(15)
      },
      nin: {
        type: Sequelize.STRING(15)
      },
      age: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SeedTrader');
  }
};