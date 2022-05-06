'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Otp', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      expiration_time: Sequelize.DATE,
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'id',
          name: 'user_id_key'
        }, 
      },
      otp_code: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Otp');
  }
};