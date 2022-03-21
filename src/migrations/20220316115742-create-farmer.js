'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Farmer', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      othername: {
        type: Sequelize.STRING,
        allowNull: true
      },
      product_farmed: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location_of_farm: {
        type: Sequelize.STRING,
        allowNull: false
      },
      size_of_farm: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone_no: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bvn: {
        type: Sequelize.STRING,
        allowNull: true
      },
      account_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nin: {
        type: Sequelize.STRING,
        allowNull: true
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false
      },
      level_of_education: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id',
          name: 'farmer_user_id'
        }, 
        unique : true
      },
      password: {
        type: Sequelize.STRING(15),
        allowNull: false
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
    await queryInterface.dropTable('Farmer');
  }
};