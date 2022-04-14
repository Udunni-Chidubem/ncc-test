'use strict';

const transactionlog = require("../models/transactionlog");

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('transaction_carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaction_log_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'transaction_log',
          key: 'id',
          name: 'transaction_log_id_key'
        }, 
      },
      cart_id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        references : {
          model : 'cart',
          key : 'id',
          name : 'cart_id_key'
        }
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
