'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('seedcompany', {
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
      name_of_company: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique:true
      },
      phone_no: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique:true
      },
      tin: {
        type: Sequelize.STRING(25),
        allowNull: true,
        unique: false
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      licensed_no: {
        type: Sequelize.STRING(30),
        unique:true
      },
      certification_number: {
        type: Sequelize.STRING(30),
        unique:true
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
    await queryInterface.dropTable('seedcompany');
  }
};