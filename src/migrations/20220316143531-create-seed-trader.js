'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('seedtrader', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
        type: Sequelize.STRING(55),
        allowNull: true
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
        type: Sequelize.STRING(30),
        allowNull: true
      },
      bvn: {
        type: Sequelize.STRING(15),
        allowNull: true
      },
      nin: {
        type: Sequelize.STRING(15),
        allowNull: true
      },
      // password: {
      //   type: Sequelize.STRING(15),
      //   allowNull: false
      // },
      age: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('seedtrader');
  }
};