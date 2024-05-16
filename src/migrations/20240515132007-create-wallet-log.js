'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wallet_logs', {
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
          key: 'id',
        }
      },
      transaction_ref: {
        type: Sequelize.STRING
      },
      linkingreference: {
        type: Sequelize.STRING
      },
      externalreference: {
        type: Sequelize.STRING
      },
      company_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'seedcompany',
          key: 'id',
        }
      },
      wallet_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'wallet',
          key: 'id',
        }
      },
      description: {
        type: Sequelize.STRING
      },
      external_message: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DOUBLE
      },
      account_no: {
        type: Sequelize.STRING
      },
      currency: {
        type: Sequelize.STRING
      },
      external_date: {
        type: Sequelize.DATE
      },
      state: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('wallet_logs');
  }
};